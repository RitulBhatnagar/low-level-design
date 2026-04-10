export{}

enum TransactionType{
    BALANCE_INQUIRY='BalanceInquiry',
    CASH_WITHDRAWAL='CashWithdrawal',
    CASH_DEPOSIT='CashDeposit'
}

enum TransactionStatus{
    FULLFILLED='FullFilled',
    REJECTED='Rejected',
    PENDING='Pending'
}

class User{
    private static counter = 0;
    id : number;
    name : string;

    constructor(name : string){
        this.id = ++User.counter;
        this.name = name;
    }
}

class Card{
    private static counter = 0;
    id : number;
    cardNumber : string;
    pin : number;         
    isActive : boolean;
    account : Account;

    constructor(cardNumber : string, pin : number, isActive : boolean, account : Account){
        this.id = ++Card.counter;
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.isActive = isActive;
        this.account = account;
    }

    checkCardActive() : boolean {
        return this.isActive;
    }
}

class Account{
    private static counter = 0;
    id : number;
    accountNumber : string;
    isActive : boolean;
    balance : number;
    user : User;

    constructor(accountNumber : string, isActive : boolean, balance : number, user : User){
        this.id = ++Account.counter;
        this.accountNumber = accountNumber;
        this.isActive = isActive;
        this.balance = balance;
        this.user = user;
    }
}


class BankBackendSystem{
    validateAccount(account : Account, transactionType : TransactionType) : boolean {
        if(!account.isActive) return false;

        if(transactionType === TransactionType.CASH_WITHDRAWAL){
            return account.balance > 0;
        }
        return true;
    }

    processTransaction(transaction : Transaction) : boolean {
        const account = transaction.account;

        if(transaction.transactionType === TransactionType.CASH_WITHDRAWAL){
            if(account.balance < transaction.amount) return false;
            account.balance -= transaction.amount;
            return true;
        }
        else if(transaction.transactionType === TransactionType.CASH_DEPOSIT){
            account.balance += transaction.amount;
            return true;
        }
        else if(transaction.transactionType === TransactionType.BALANCE_INQUIRY){
            return true;
        }
        return false;
    }
}

class CashDispenser{
    cashAvailable : number;

    constructor(cashAvailable : number){
        this.cashAvailable = cashAvailable;
    }

    hasSufficientCash(amount : number) : boolean {
        return this.cashAvailable >= amount;
    }

    // Bug fix: was calling itself recursively — now calls hasSufficientCash
    dispenseCash(amount : number) : number | string {
        if(this.hasSufficientCash(amount)){
            this.cashAvailable -= amount;
            return amount;
        }
        return `Not enough cash available`;
    }
}

class Transaction{
    private static counter = 0;
    id : number;
    transactionType : TransactionType;
    status : TransactionStatus;
    timestamp : Date;
    amount : number;
    account : Account;

    // Bug fix: amount | 0 is bitwise OR — use ?? 0 instead
    constructor(transactionType : TransactionType, account : Account, amount : number = 0){
        this.id = ++Transaction.counter;
        this.transactionType = transactionType;
        this.status = TransactionStatus.PENDING;
        this.amount = amount;
        this.account = account;
        this.timestamp = new Date();
    }

    setStatus(status : TransactionStatus){
        this.status = status;
    }
}

class Session{
    private static counter = 0;
    id : number;
    isAuthenticated : boolean = false;
    startTime : Date;
    card : Card;

    constructor(card : Card){
        this.id = ++Session.counter;
        this.startTime = new Date();
        this.card = card;
    }

    // Bug fix: pinNumber was received but never checked
    validateUser(user : User, card : Card, pinNumber : number) : boolean {
        if(card.isActive && card.account.user === user && card.pin === pinNumber){
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }
}

class Atm{
    session : Session | null = null;
    cashDispenser : CashDispenser;
    bankBackend : BankBackendSystem;
    insertedCard : Card | null = null;

    constructor(cashAvailable : number){
        this.cashDispenser = new CashDispenser(cashAvailable);
        this.bankBackend = new BankBackendSystem();
    }

    insertCard(card : Card) : string {
        if(!card.checkCardActive()){
            return `Card is not active`;
        }
        this.insertedCard = card;
        this.session = new Session(card);
        return `Card inserted. Please enter your PIN.`;
    }

    // Bug fix: was always returning the error string even on success
    enterPin(pinNumber : number) : string {
        if(!this.insertedCard || !this.session){
            return `Please insert a card first`;
        }
        const valid = this.session.validateUser(this.insertedCard.account.user, this.insertedCard, pinNumber);
        if(valid){
            return `Authentication successful`;
        }
        return `Sorry, wrong PIN number`;
    }

    selectTransaction(type : TransactionType, amount : number = 0) : string {
        if(!this.session?.isAuthenticated || !this.insertedCard){
            return `Please authenticate first`;
        }

        const account = this.insertedCard.account;

        if(!this.bankBackend.validateAccount(account, type)){
            return `Transaction not allowed — account inactive or insufficient balance`;
        }

        const transaction = new Transaction(type, account, amount);

        if(type === TransactionType.BALANCE_INQUIRY){
            transaction.setStatus(TransactionStatus.FULLFILLED);
            return `Your balance is: ${account.balance}`;
        }

        else if(type === TransactionType.CASH_WITHDRAWAL){
            if(!this.cashDispenser.hasSufficientCash(amount)){
                transaction.setStatus(TransactionStatus.REJECTED);
                return `ATM does not have sufficient cash`;
            }
            const success = this.bankBackend.processTransaction(transaction);
            if(success){
                this.cashDispenser.dispenseCash(amount);
                transaction.setStatus(TransactionStatus.FULLFILLED);
                return `Dispensed ${amount}. Remaining balance: ${account.balance}`;
            }
            transaction.setStatus(TransactionStatus.REJECTED);
            return `Insufficient account balance`;
        }

        else if(type === TransactionType.CASH_DEPOSIT){
            const success = this.bankBackend.processTransaction(transaction);
            if(success){
                transaction.setStatus(TransactionStatus.FULLFILLED);
                return `Deposited ${amount}. New balance: ${account.balance}`;
            }
            transaction.setStatus(TransactionStatus.REJECTED);
            return `Deposit failed`;
        }

        return `Unknown transaction type`;
    }

    ejectCard() : string {
        this.insertedCard = null;
        this.session = null;
        return `Card ejected. Thank you!`;
    }
}

// --- Usage ---
const user1 = new User("Alice");
const account1 = new Account("ACC001", true, 5000, user1);
const card1 = new Card("CARD001", 1234, true, account1);

const atm = new Atm(10000);

console.log(atm.insertCard(card1));                                         // Card inserted
console.log(atm.enterPin(9999));                                            // Wrong PIN
console.log(atm.enterPin(1234));                                            // Authenticated
console.log(atm.selectTransaction(TransactionType.BALANCE_INQUIRY));        // Balance: 5000
console.log(atm.selectTransaction(TransactionType.CASH_WITHDRAWAL, 1000)); // Dispensed 1000
console.log(atm.selectTransaction(TransactionType.CASH_DEPOSIT, 500));     // Deposited 500
console.log(atm.selectTransaction(TransactionType.BALANCE_INQUIRY));        // Balance: 4500
console.log(atm.ejectCard());                                               // Card ejected