# Designing a ATM System

## Requirements

### Functional Requirements
 - The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
 - Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
 - The system should interact with a bank's backend system to validate user accounts and perform transactions.
 - The ATM should have a cash dispenser to dispense cash to users.

### Non Functional Requirements
 - The system should handle concurrent access and ensure data consistency.
 - The ATM should have a user-friendly interface for users to interact with.

## Core Entites
1. `Atm`
2. `User`
3. `Card`
4. `CashDispenser`
5. `BankBacknedSystem`
6. `Transaction`
7. `Account`
8. `Session`

## Class Diagram
```
enum TransactionType {BalanceInquiry, CashWithdrawal, CashDeposit}
enum TransactionStatus {FULLFILLED, REJECTED, PENDING}

User
|- id
|- name


Card
|- id
|- cardNumber
|- isActive
|- account : Account


Account
|- id
|- accountNumber
|- isActive
|- balance
|- user : User


BankBackendSystem
|- validateAccount(account, TransactionType)

CashDispenser
|- cashAvilable : number
|- hasSufficentCash() : boolean
|- despenseCash()

Transaction
|- id
|- transactionType : TransactionType
|- status : TransactionStatus
|- timestamp : Date
|- amount : number
|- account : Account


Session
|- id
|- isAuthenticated : boolean
|- startTime : Date
|- card : Card
|- validateUser(user, card, pinNumber)


Atm
|- session : Session
|- cashDispenser : CashDispenser
|- bankBackend : BankBackendSystem
|- insertCard(Card)
|- enterPin(pinNumber)
|- selectTransaction(type)
|- ejectCard()
```
