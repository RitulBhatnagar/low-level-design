const generateShortId = (): string => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };
  

enum VehicleType{
    CARS = 'CARS',
    MOTORCYCLES = 'MOTORCYCLES',
    TRUCKS = 'TRUCKS'
}

class Vehicle{
    vechicleNumber : string;
    vechicleType : VehicleType;

    constructor(vechicleNumber : string, vechicleType : VehicleType){
        this.vechicleType = vechicleType;
        this.vechicleNumber = vechicleNumber;
    }
}

class ParkingSpots{
    private static counter = 0;
    id  : number;
    spotType : VehicleType;
    isAvilable : boolean;
    vehicle : Vehicle | null;

    constructor(spotType : VehicleType){
        this.id = ++ParkingSpots.counter;
        this.spotType = spotType;
        this.isAvilable  = true;
        this.vehicle = null;
    }

    parkVehicle(vehicle : Vehicle){
        if(vehicle.vechicleType === this.spotType){
            this.isAvilable = false;
            this.vehicle = vehicle;
        }
    }

    removeVehicle(vehicle : Vehicle){
        if(this.vehicle && vehicle.vechicleNumber === this.vehicle.vechicleNumber){
            this.vehicle = null;
            this.isAvilable = true;
        }
    }
}

class ParkingLevels{
    private static counter = 0;
    id  : number;
    spots : ParkingSpots[] = [];

    constructor(carSpots:number, bikeSpots:number, truckSpots:number){
        this.id = ++ParkingLevels.counter;
        this.createSpots(carSpots,VehicleType.CARS);
        this.createSpots(bikeSpots,VehicleType.MOTORCYCLES);
        this.createSpots(truckSpots,VehicleType.TRUCKS);
        
    }

    private createSpots(count : number, type : VehicleType){
        for(let i=0; i<count; i++){
            this.spots.push(new ParkingSpots(type));
        }
    }

    findAvilableSpot(vehicleType : VehicleType){
        const spot = this.spots.find(
            (spot) => spot.isAvilable === true && spot.spotType === vehicleType
          );

          return spot;
    }
    parkVehicle(vehicle: Vehicle): ParkingSpots | null {
        const spot = this.findAvilableSpot(vehicle.vechicleType);
    
        if (!spot) {
            return null;
        }
    
        spot.parkVehicle(vehicle);
        return spot;
    }

    removeVehicle(vehicle : Vehicle){
        const spot = this.spots.find((spot) => spot.vehicle?.vechicleNumber === vehicle.vechicleNumber);
        if(!spot){
            return false;
        }
        spot.removeVehicle(vehicle);
        return true;
    }
}


class ParkingLot{
    levels : ParkingLevels[]= [];
    tickets : ParkingTicket[] = [];

    addLevel(parkingLevel : ParkingLevels){
        this.levels.push(parkingLevel);
    }

    addTicket(ticket : ParkingTicket){
        this.tickets.push(ticket);
    }

    getActiveTicket(vehicleNumber: string): ParkingTicket | undefined {
        return this.tickets.find(
            t => t.vehicle.vechicleNumber === vehicleNumber && t.exitTime === null
        );
    }

    removeVehicle(vehicle : Vehicle){
        this.tickets = this.tickets.filter((ticket) => ticket.vehicle.vechicleNumber!==vehicle.vechicleNumber);
    }

    parkVehicle(vehicle: Vehicle): ParkingSpots | null {
        for (let i = 0; i < this.levels.length; i++) {
            const spot = this.levels[i].parkVehicle(vehicle);
    
            if (spot) {
                console.log(`Vehicle is parked at level ${i + 1}`);
                return spot;
            }
        }
    
        console.log(`Parking is full`);
        return null;
    }
    exitVehicle(vehicle : Vehicle){
        for(let i=0; i<this.levels.length; i++){
            const removeVehicle = this.levels[i].removeVehicle(vehicle);
            if(removeVehicle){
                console.log(`Vehicle removed from level ${i+1}`);
                break;
            }
        }
    }
}

class ParkingTicket {
    ticketId: string;
    spot: ParkingSpots;
    vehicle: Vehicle;
    entryTime: Date;
    exitTime: Date | null;

    constructor(spot: ParkingSpots, vehicle: Vehicle) {
        this.ticketId = generateShortId();
        this.spot = spot;
        this.vehicle = vehicle;
        this.entryTime = new Date();
        this.exitTime = null;
    }

    closeTicket() {
        this.exitTime = new Date();
    }
}

class EntryGate {

    constructor(private parkingLot : ParkingLot) {
    }

    generateTicket(vehicle: Vehicle, spot: ParkingSpots): ParkingTicket | null {

        const existing = this.parkingLot.getActiveTicket(vehicle.vechicleNumber)

        if (existing) {
            console.log("Ticket already exists for this vehicle");
            return null;
        }

        const ticket = new ParkingTicket(spot, vehicle);

        this.parkingLot.addTicket(ticket);

        return ticket;
    }
}


class Exitgate{
    constructor(private parkingLot : ParkingLot) {}

    closeTicket(vehicle : Vehicle){
        const ticket= this.parkingLot.getActiveTicket(vehicle.vechicleNumber);

        if(!ticket){

        }
        ticket.closeTicket();
        this.parkingLot.removeVehicle(ticket.vehicle);

        console.log("Exit Processed")
    }
}

const parkingLot = new ParkingLot();

const level1 = new ParkingLevels(1,20,10);
const level2 = new ParkingLevels(20,10,20);

parkingLot.addLevel(level1)
parkingLot.addLevel(level2);

const vechicle1 = new Vehicle("UP14EW2314", VehicleType.CARS);
const vehicle2 = new Vehicle("UP23QW3451", VehicleType.CARS);
const vehicle3 = new Vehicle("UP16OP7899", VehicleType.CARS);

parkingLot.parkVehicle(vechicle1);
parkingLot.parkVehicle(vehicle2);
parkingLot.exitVehicle(vechicle1);
parkingLot.parkVehicle(vehicle3);

