interface Pizza{
    getCost(): number;
    getDescription(): string;
}

class PlainPizza implements Pizza{
    getCost() : number{
        return 5.00;
    }
    getDescription(): string {
        return "Plain Pizza";
    }
}

class ToppingDecorator implements Pizza{
    protected tempPizza: Pizza;

    constructor(newPizza: Pizza){
        this.tempPizza = newPizza;
    }

    getCost(): number {
        return this.tempPizza.getCost();
    }

    getDescription(): string {
        return this.tempPizza.getDescription();
    }
}

class CheeseDecorator extends ToppingDecorator{
   getCost(): number {
        return super.getCost() + 1.50;
   }
      getDescription(): string {
        return super.getDescription() + ", Adding Cheese";
    }
}

class PepperoniDecorator extends ToppingDecorator{
    getCost(): number {
        return super.getCost() + 2.00;
    }
    getDescription(): string {
        return super.getDescription() + ", Adding Pepperoni";
    }
}

class MushroomDecorator extends ToppingDecorator{
    getCost(): number {
        return super.getCost() + 1.00;
    }
    getDescription(): string {
        return super.getDescription() + ", Adding Mushrooms";
    }
}


const pizzaOrder = new PlainPizza();
console.log(pizzaOrder.getDescription() + " Cost: $" + pizzaOrder.getCost());

const cheesePizza = new CheeseDecorator(pizzaOrder);
console.log(cheesePizza.getDescription() + " Cost: $" + cheesePizza.getCost());

const pepperoniCheesePizza = new PepperoniDecorator(cheesePizza);
console.log(pepperoniCheesePizza.getDescription() + " Cost: $" + pepperoniCheesePizza.getCost());

const mushroomPepperoniCheesePizza = new MushroomDecorator(pepperoniCheesePizza);
console.log(mushroomPepperoniCheesePizza.getDescription() + " Cost: $" + mushroomPepperoniCheesePizza.getCost());