# Design a car Rental System

## Requirements

### Functional Requirements
- The car rental system should allow customers to browse and reserve available cars for specific dates.
- Each car should have details such as make, model, year, license plate number, and rental price per day.
- Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
- The system should handle reservations, including creating, modifying, and canceling reservations.
- The system should keep track of the availability of cars and update their status accordingly.
- The system should handle customer information, including name, contact details, and driver's license information.
- The system should handle payment processing for reservations.
- The system should be able to handle concurrent reservations and ensure data consistency.

## Core Entites
 - `CarDetails`
 - `Car`
 - `Reservation`
 - `Customer`
 - `PaymentProcessing`
 - `CarRentalSystem`

## Class Diagram
```
enum CarType<SUV, SEDAN, LUXURY, HATCHBACK>
enum CarStatus<AVILABLE, RESERVERD, UNDER_MAINTENANCE>
enum ReservationStatus<CREATED, MODIFIED, CANCELLED, CONFIRMED>
enum PaymentStatus<FULLFILLED, REJECTED, PENDING>

interface Payment
|- pay(amoount : number) : PaymentStatus


UpiPayment implements Payment
|- pay(amoount : number) : PaymentStatus

DebitCardPayment implements Payment
|- pay(amoount : number) : PaymentStatus

CreditCardPayment implements Payment
|- pay(amoount : number) : PaymentStatus


CarDetails
- licensePlateNumber : string
- basePrice : number
- make : string
- model : string
- year : Date

Car 
- id
- carDetails : CarDetails
 - carType : CarType
 - carStatus : CarStatus
- updateStatus(status : CarStatus)

Reservation
- id
- reservedDate : Date
- returnDate : Date
- reservationTime : Date
- totalAmount : number
- customer : Customer
- reservationStatus : ReservationStatus
- car :Car
- payment : PaymentProcessing
- modify(newStartDate, newEndDate)
- cancel()


Customer 
-  id
- name
- drivingLicense
- contactNumber


PaymentProcessing
- id
- amount : number
- paymentStatus : PaymentStatus
- transactionTime : Date
- paymentMethod : Payment
- processPayment() : PaymentStatus


CarRentalSystem
- listCars(carName, carType, dates, avalibiltyStatus) : Car[]
- createCustomer()
- createReservation(customer, car, startDate, endDate) : Reservation
- modifyReservation(reservationId, newStartDate, newEndDate)
- cancelReservation(reservationId)
```