# Design Parking Lot System

## Requirements

### Functional Requirements
 |- The parking lot should have multiple levels, each level with a certain number of parking spots.
 |- The parking lot should support different types of vehicles, such as cars, motorcycles, and trucks.
 |- Each parking spot should be able to accommodate a specific type of vehicle.
 |- The system should assign a parking spot to a vehicle upon entry and release it when the vehicle exits.
 |- The system should track the availability of parking spots and provide real-time information to customers.

 ### Non Functional Requirement
 |- The system should handle multiple entry and exit points and support concurrent access.


## Core entites
1. enum VehicleType<CARS, MOTORCYCLES, TRUCKS>
2. `ParkingSpots`
3. `ParkingLevels`
4. `Vehicle`
5. `ParkingLot`
6. `EntryGate`
7. `ExitGate`
8. `ParkingTicket`


## Class Diagrams

```
ParkingLot
|- List<Level>
|- getAvilableSpots()
|- parkVehicle(Vehicle)
|- exitVechicle(Vehicle)

Vehicle
|- vehicleNumber
|- vechiclesType : VechileType

ParkingLevels
|- id
|- spots : List<ParkingSpots>
|- parkVehicle(Vehicle)
|- removeVehicle(Vehicle)
|- findAvilableSpot(VehicleType)

ParkingSpots
|- id
|- spotType
|- isAvilable
|- vehicle
|- parkVehicle()
|- removeVehicle()

ParkingTicket
|- ticketId
|- spot
|- Vechicle
|- entryTime
|- exitTime
|- generateTicket()


EntryGate
|- generateTicket(Vechicle)

ExitGate
|- processTicket(Vechicle)

```