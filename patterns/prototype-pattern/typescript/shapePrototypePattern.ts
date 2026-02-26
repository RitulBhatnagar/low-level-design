export {} 

interface Cloneable {
    clone(): Cloneable;
}

class Circle implements Cloneable {
    color: string;
    radius: number;

    constructor(color: string, radius: number) {
        this.color  = color;
        this.radius = radius;
    }
    clone(): Circle {
        return Object.assign(new Circle("", 0), this);
        // radius and color are primitives — no deep copy needed
    }

    printInfo(): void {
        console.log(`Circle [Color: ${this.color}, Radius: ${this.radius.toFixed(1)}]`);
    }
}

class Rectangle implements Cloneable {
    color: string;
    width: number;
    height: number;

    constructor(color: string, width: number, height: number) {
        this.color  = color;
        this.width  = width;
        this.height = height;
    }

    clone(): Rectangle {
        return Object.assign(new Rectangle("", 0, 0), this);
    }

    printInfo(): void {
        console.log(`Rectangle [Color: ${this.color}, Width: ${this.width.toFixed(1)}, ` +
        `Height: ${this.height.toFixed(1)}]`);
    }
}

// ─── Usage ────────────────────────────────────
const circle       = new Circle("Red", 5);
const clonedCircle = circle.clone() as Circle;
clonedCircle.color  = "Blue";
clonedCircle.radius = 10;

circle.printInfo();        
clonedCircle.printInfo();  

const rect       = new Rectangle("Green", 10, 20);
const clonedRect = rect.clone() as Rectangle;
clonedRect.color  = "Yellow";
clonedRect.width  = 50;
clonedRect.height = 100;

rect.printInfo();       
clonedRect.printInfo();  