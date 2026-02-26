interface Shape{
    area(): number;
    describe(): string;
}

class Circle implements Shape{
    radius: number;


    constructor(radius: number) {
        this.radius = radius;
    }
   area(): number {
     return Math.PI * this.radius * this.radius;  
   }

   describe(): string {
       return `Circle with radius ${this.radius}`;
   }
}


class Triangle implements Shape{
    base: number;
    height: number;

    constructor(base: number, height: number) {
        this.base = base;
        this.height = height;
    }

    area(): number {
        return 0.5 * this.base * this.height;
    }

    describe():string{
        return `Triangle with base ${this.base} and height ${this.height}`;
    }
}

class Rectangle implements Shape{
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    area(): number {
        return this.width * this.height;
    }

    describe(): string {
        return `Rectangle with width ${this.width} and height ${this.height}`;
    }
}

class ShapeFactory{
   createShape(typpe: string, ...params: number[]): Shape {
        switch(typpe.toLowerCase()){
            case 'circle':
                return new Circle(params[0]);
            case 'triangle':
                return new Triangle(params[0], params[1]);
            case 'rectangle':
                return new Rectangle(params[0], params[1]);
            default:
                throw new Error('Invalid shape type');
        }
   }

   describeShape(type : string, ...params : number[]) : void{
       const shape = this.createShape(type, ...params);
       console.log(shape.describe());
   }
}

const factory = new ShapeFactory();
console.log(factory.createShape('circle', 5).area());
console.log(factory.createShape('triangle', 4, 6).area());
console.log(factory.createShape('rectangle', 4, 5).area());
factory.describeShape('circle', 5);
factory.describeShape('triangle', 4, 6);
factory.describeShape('rectangle', 4, 5);