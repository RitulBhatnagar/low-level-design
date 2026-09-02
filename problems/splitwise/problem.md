# Design Splitwise

## Requirements

### Functional Requirements

- Users should be able to add expenses within a group, specifying the amount, description, and participants.

- user will be able to create group and add memebers in it.

- user will be able to track the overall and personal expense and on the group memeber level

- The system should support different split methods, such as equal split, percentage split, and exact amounts.

- user should be able to view the transaction history.

- Users should be able to view their individual balances with other users and settle up the balances.


### Non Functional Requirement

- The system should handle concurrent transactions and ensure data consistency.


## Core Entities
- `User`
- `Group`
- `Expense`
- `transactionHistory`
- `Split`
- `Balances`
- `splitWiseSystem`


## Class Diagram

```

enum SplitMethod<EQUAL, PERCENTAGE, EXACT>

User
- id : number
- name : string
- email : string

Group
- id : number
- groupName : string
- user : User[]
- creator : User
- totalExpense : number

Expense
- id : number
- description : string
- amount : number
- splits : Split[]
- group : Group
- splitMethod : SplitMethod


transactionHistory
- id : number
- paidTo : user
- amount : number
- paidBy : user
- transactionTime : DateTime

Balances
- id : number
- settled:boolean
- payer : user
- payee : user
- amount : number

Split
- id : number
- user : User
- expense : Expense
- amount : number

splitWiseSystem
- addExpense(splitMethod : SplitMethod, group : Group, amount : number, description : string, splits : Split[])
- createGroup()
- addMembersToGroup(users : User[])
- fetchExpense()
- fetchTransactionHistory()
- settleUpExpense(payer : User, payee : User, amount : number)
```



