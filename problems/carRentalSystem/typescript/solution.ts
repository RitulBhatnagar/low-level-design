export {}

enum CarType{
    SUV='SUV',
    SEDAN='SEDAN',
    LUXURY='LUXURY',
    HATCBACK='HATCHBACK'
}
enum CarStatus{
    AVILABLE='AVILABLE',
    RESERVED='RESERVED',
    UNDER_MAINTENANCE='UNDER_MAINTENANCE'
}
enum ReservationStatus{
    CREATED='CREATED',
    MODIFIED='MODIFIED',
    CANCELLED='CANCELLED',
    CONFIRMED='CONFIRMED'
}
enum PaymentStatus{
    FULLFILLED = 'FULLFILLED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}

interface Payment{
    pay(amount : number) : PaymentStatus
}

class UpiPayment implements Payment{
    pay(amount: number): PaymentStatus {
        console.log(`Processing Payment through UPI ${amount}`)
        return PaymentStatus.FULLFILLED;
    }
}

class DebitCardPayment implements Payment{
    pay(amount: number): PaymentStatus {
        console.log(`Processing Payment through Debit Card ${amount}`)
        return PaymentStatus.FULLFILLED;
    }
}

class CreditCardPayment implements Payment{
    pay(amount: number): PaymentStatus {
        console.log(`Processing Payment through Credit Card ${amount}`)
        return PaymentStatus.FULLFILLED;
    }
}

class CarDetails{
    name : string;
    licensePlateNumber : string;
    basePrice : number;
    make : string;
    model : string;
    year : Date

    constructor(_name:string,_licensePlateNumber:string, _basePrice : number, _make:string, _model: string, _year:Date){
        this.licensePlateNumber = _licensePlateNumber;
        this.basePrice = _basePrice;
        this.make = _make;
        this.model = _model;
        this.year = _year;
        this.name = _name;
    }
}


class Car{
    private static counter = 0;
    id : number;
    carDetails : CarDetails;
    carType : CarType;
    carStatus : CarStatus;

    constructor(carDetails : CarDetails, carType : CarType, carStatus : CarStatus){
        this.carDetails = carDetails;
        this.carType = carType;
        this.carStatus = carStatus;
        this.id = ++Car.counter;
    }
    updateStatus(status : CarStatus){
        this.carStatus = status;
    }
}

class Customer{
        private static counter = 0;
        id : number;
        name : string;
        drivingLicense : string;
        contactNumber : string;


        constructor(name:string, drivingLicense : string, contactNumber : string){
            this.id = ++Customer.counter;
            this.name = name;
            this.drivingLicense = drivingLicense;
            this.contactNumber = contactNumber;
        }
}

class Reservation{
        private static counter = 0;
        id : number;
        reserveDate : Date;
        returnDate : Date;
        reservationTime : Date;
        totalAmount : number;
        customer : Customer;
        reservationStatus : ReservationStatus;
        car : Car;
        paymentProcessing : PaymentProcessing;


        constructor(reserveDate : Date, returnDate : Date, customer : Customer, car : Car){
            this.id  = ++Reservation.counter;
            this.reserveDate = reserveDate;
            this.returnDate = returnDate;
            this.reservationTime = new Date();
            this.customer = customer;
            this.car = car;
            this.reservationStatus = ReservationStatus.CREATED;
            this.totalAmount = this.calculateAmount(reserveDate, returnDate);
        }

        private calculateAmount(startDate: Date, endDate: Date): number {
            const msPerDay = 1000 * 60 * 60 * 24;
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
            return days * this.car.carDetails.basePrice;
        }

        modify(newStartDate: Date, newEndDate: Date): void {
            this.reserveDate = newStartDate;
            this.returnDate = newEndDate;
            this.totalAmount = this.calculateAmount(newStartDate, newEndDate);
            this.reservationStatus = ReservationStatus.MODIFIED;
            console.log(`Reservation ${this.id} modified. New total: $${this.totalAmount}`);
        }

        cancel(): void {
            if (this.reservationStatus === ReservationStatus.CANCELLED) {
                console.log(`Reservation ${this.id} is already cancelled.`);
                return;
            }
            this.reservationStatus = ReservationStatus.CANCELLED;
            this.car.updateStatus(CarStatus.AVILABLE);
            console.log(`Reservation ${this.id} cancelled. Car ${this.car.id} is now available.`);
        }
}

class PaymentProcessing{
        private static counter = 0;
        id : number;
        amount : number;
        paymentStatus : PaymentStatus;
        transactionTime : Date;
        paymentMethod : Payment;

        constructor(amount : number){
            this.id = ++PaymentProcessing.counter;
            this.amount = amount;
            this.transactionTime = new Date();
            this.paymentStatus = PaymentStatus.PENDING;
        }

        processPayment(paymentMethod: Payment): PaymentStatus {
            this.paymentMethod = paymentMethod;
            this.paymentStatus = paymentMethod.pay(this.amount);
            this.transactionTime = new Date();
            console.log(`Payment ${this.id} processed with status: ${this.paymentStatus}`);
            return this.paymentStatus;
        }
}

class CarRentalSystem {
    private cars: Car[] = [];
    private customers: Customer[] = [];
    private reservations: Map<number, Reservation> = new Map();
    // Tracks which car IDs are being reserved to prevent double-booking
    private reservingCarIds: Set<number> = new Set();

    addCar(car: Car): void {
        this.cars.push(car);
    }

    listCars(
        carName?: string,
        carType?: CarType,
        startDate?: Date,
        endDate?: Date,
        availabilityStatus?: CarStatus
    ): Car[] {
        return this.cars.filter(car => {
            if (carName && !car.carDetails.name.toLowerCase().includes(carName.toLowerCase())) return false;
            if (carType && car.carType !== carType) return false;
            if (availabilityStatus && car.carStatus !== availabilityStatus) return false;
            if (startDate && endDate) {
                const isBooked = Array.from(this.reservations.values()).some(r =>
                    r.car.id === car.id &&
                    r.reservationStatus !== ReservationStatus.CANCELLED &&
                    r.reserveDate < endDate &&
                    r.returnDate > startDate
                );
                if (isBooked) return false;
            }
            return true;
        });
    }

    createCustomer(name: string, drivingLicense: string, contactNumber: string): Customer {
        const customer = new Customer(name, drivingLicense, contactNumber);
        this.customers.push(customer);
        console.log(`Customer created: ${customer.name} (ID: ${customer.id})`);
        return customer;
    }

    createReservation(
        customer: Customer,
        car: Car,
        startDate: Date,
        endDate: Date,
        paymentMethod: Payment
    ): Reservation | null {
        // Prevent concurrent double-booking of the same car
        if (this.reservingCarIds.has(car.id)) {
            console.log(`Car ${car.id} is currently being reserved. Try again shortly.`);
            return null;
        }
        if (car.carStatus !== CarStatus.AVILABLE) {
            console.log(`Car ${car.id} is not available for reservation.`);
            return null;
        }

        this.reservingCarIds.add(car.id);
        try {
            const reservation = new Reservation(startDate, endDate, customer, car);
            const payment = new PaymentProcessing(reservation.totalAmount);
            const status = payment.processPayment(paymentMethod);

            if (status !== PaymentStatus.FULLFILLED) {
                console.log(`Payment failed for reservation. Status: ${status}`);
                return null;
            }

            reservation.paymentProcessing = payment;
            reservation.reservationStatus = ReservationStatus.CONFIRMED;
            car.updateStatus(CarStatus.RESERVED);
            this.reservations.set(reservation.id, reservation);
            console.log(`Reservation ${reservation.id} confirmed for ${customer.name}. Total: $${reservation.totalAmount}`);
            return reservation;
        } finally {
            this.reservingCarIds.delete(car.id);
        }
    }

    modifyReservation(reservationId: number, newStartDate: Date, newEndDate: Date): void {
        const reservation = this.reservations.get(reservationId);
        if (!reservation) {
            console.log(`Reservation ${reservationId} not found.`);
            return;
        }
        if (reservation.reservationStatus === ReservationStatus.CANCELLED) {
            console.log(`Cannot modify a cancelled reservation.`);
            return;
        }
        reservation.modify(newStartDate, newEndDate);
    }

    cancelReservation(reservationId: number): void {
        const reservation = this.reservations.get(reservationId);
        if (!reservation) {
            console.log(`Reservation ${reservationId} not found.`);
            return;
        }
        reservation.cancel();
    }
}

// --- Demo ---
const system = new CarRentalSystem();

const carDetails1 = new CarDetails('Toyota Camry', 'ABC-1234', 50, 'Toyota', 'Camry', new Date('2022-01-01'));
const carDetails2 = new CarDetails('BMW X5', 'XYZ-5678', 150, 'BMW', 'X5', new Date('2023-01-01'));

const car1 = new Car(carDetails1, CarType.SEDAN, CarStatus.AVILABLE);
const car2 = new Car(carDetails2, CarType.SUV, CarStatus.AVILABLE);
system.addCar(car1);
system.addCar(car2);

const customer = system.createCustomer('Alice', 'DL-999', '+1-555-0100');

const start = new Date('2026-05-01');
const end = new Date('2026-05-05');

console.log('\n--- Available SEDAN cars ---');
console.log(system.listCars(undefined, CarType.SEDAN, start, end, CarStatus.AVILABLE).map(c => c.carDetails.name));

const reservation = system.createReservation(customer, car1, start, end, new UpiPayment());

console.log('\n--- Available SEDAN cars after booking ---');
console.log(system.listCars(undefined, CarType.SEDAN, start, end, CarStatus.AVILABLE).map(c => c.carDetails.name));

if (reservation) {
    console.log('\n--- Modifying reservation ---');
    system.modifyReservation(reservation.id, new Date('2026-05-01'), new Date('2026-05-07'));

    console.log('\n--- Cancelling reservation ---');
    system.cancelReservation(reservation.id);
}

console.log('\n--- Available SEDAN cars after cancellation ---');
console.log(system.listCars(undefined, CarType.SEDAN, start, end, CarStatus.AVILABLE).map(c => c.carDetails.name));