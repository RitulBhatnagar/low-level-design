import uuid
from enum import Enum
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

def generate_uuid():
    return str(uuid.uuid4())[:8]

class VehicleType(Enum):
    CAR = 'CARS'
    MOTORCYCLE = 'MOTORCYCLES'
    TRUCKS = 'TRUCKS'

@dataclass
class Vehicle:
    vehicleNumber : str
    vechicleType : VehicleType

class ParkingSpots:
    _counter = 0

    def __init__(self, spotType : VehicleType):
        ParkingSpots._counter+=1
        self.id = ParkingSpots._counter
        self.spot_type = spotType
        self.is_avilable = True
        self.vehicle : Optional['Vehicle'] = None

    def parkVehicle(self, vehicle : Vehicle):
        if(vehicle.vechicleType==self.spot_type):
            self.is_avilable = False
            self.vehicle = vehicle
    
    def removeVehicle(self, vehicle : Vehicle):
        if(self.vehicle and vehicle.vehicleNumber == self.vehicle.vehicleNumber):
            self.vehicle = None
            self.is_avilable = True


class ParkingLevel:
    _counter = 0
    

    def __init__(self, carSpots : int, truckSpots : int, bikeSpots : int):
        ParkingLevel._counter+=1
        self.id = ParkingLevel._counter
        self.spots: list['ParkingSpots'] = []
        self._create_spots(carSpots, VehicleType.CAR)
        self._create_spots(bikeSpots, VehicleType.MOTORCYCLE)
        self._create_spots(truckSpots, VehicleType.TRUCKS)

    def _create_spots(self, count : int, type : VehicleType):
        for i in range(count):
            self.spots.append(ParkingSpots(type))   
    
    def find_avilable_spot(self, vehicleType : VehicleType):
        return next((s for s in self.spots if s.is_avilable and s.spot_type==vehicleType), None)
    
    def parkVehicle(self, vehicle : Vehicle):
        spot = self.find_avilable_spot(vehicle.vechicleType)

        if(spot==None):
            return None
        
        spot.parkVehicle(vehicle)
        return spot
    
    def remove_vehicle(self, vehicle: Vehicle):
        spot = next((s for s in self.spots if s.vehicle and s.vehicle.vehicleNumber == vehicle.vehicleNumber), None)

        if not spot:
            return False
        spot.removeVehicle(vehicle)
        return True
    
class ParkingTicket:

    def __init__(self, spot : ParkingSpots, vehicle : Vehicle):
        self.ticketId = generate_uuid()
        self.spot = spot
        self.vehicle = vehicle
        self.entryTime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.exitTime = None
    
    def closeTicket(self):
        self.exitTime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        

class ParkingLot:

    def __init__(self):
        self.levels : list['ParkingLevel'] = []
        self.tickets : list['ParkingTicket'] = []
    
    def addLevel(self, parkingLevel : ParkingLevel):
        self.levels.append(parkingLevel)
    
    def addTicket(self, ticket : ParkingTicket):
        self.tickets.append(ticket)
    
    def getActiveTicket(self, vehicleNumber : str):
        tck = next((s for s in self.tickets if s.vehicle.vehicleNumber == vehicleNumber and s.exitTime == None ), None)
        return tck
    
    def removeVehicle(self, vehicle : Vehicle):
        self.tickets = [t for t in self.tickets if t.vehicle.vehicleNumber != vehicle.vehicleNumber]
    
    def parkVehicle(self, vehicle : Vehicle):
        for i in range(len(self.levels)):
            spot = self.levels[i].parkVehicle(vehicle)

            if(spot):
                print(f"[vehicle is parked at level {i+1}]")
                return spot
        
        print("parking is full")
        return None
    
    def exitVehicle(self, vehicle : Vehicle):
        for i in range(len(self.levels)):
            remove_vehicle = self.levels[i].remove_vehicle(vehicle)

            if(remove_vehicle):
                print(f"[Vehicle remove from level {i+1}]")
                break


class EntryGate:

    def __init__(self, parkingLot : ParkingLot):
        self.parking_lot = parkingLot

    def generateTicket(self, vechicle : Vehicle, spot : ParkingSpots):
        exisisting = self.parking_lot.getActiveTicket(vechicle.vehicleNumber)

        if(exisisting):
            print("Ticket already exists for this vehicle")
            return None
        
        ticket = ParkingTicket(spot, vechicle)

        self.parking_lot.addTicket(ticket)

        return ticket
    
class ExitGate:

    def __init__(self, parkingLot : ParkingLot):
        self.parking_lot = parkingLot
    
    def closeTicket(self, vehicle : Vehicle):
        ticket = self.parking_lot.getActiveTicket(vehicle.vehicleNumber)

        if(ticket==None):
            return None
        
        ticket.closeTicket()
        self.parking_lot.removeVehicle(ticket.vehicle)

        print("Exit Processed")


        

