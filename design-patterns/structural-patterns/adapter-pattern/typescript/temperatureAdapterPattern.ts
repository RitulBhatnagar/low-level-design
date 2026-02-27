interface Thermometer {
    getTermperature(): number;
}

class FahrenheitSensor implements Thermometer {
    private temperature: number;

    constructor(temp : number){
        this.temperature = temp;
    }

    getTermperature(): number {
        return this.temperature;
    }
}

class CelsiusSensor implements Thermometer{
    getTermperature(): number {
        return 25; 
    }
}

class FahrenheitSensorAdapter implements Thermometer {
    farhenitSensor: FahrenheitSensor;
    constructor(farhenitSensor: FahrenheitSensor) {        
        this.farhenitSensor = farhenitSensor;
    }

    getTermperature(): number {
        const temp = this.farhenitSensor.getTermperature();
        return (temp - 32) * 5 / 9;
    }
}


const temperature = new FahrenheitSensorAdapter(new FahrenheitSensor(98.6));
console.log(temperature.getTermperature());