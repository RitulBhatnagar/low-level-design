interface Subject{
    subsribe(o : Observer):void;
    unsubsribe(o : Observer) : void;
    notify() : void;
}

interface Observer{
    update(temp : number, humidity : number, pressure : number, avgTemp : number) : void; 
}

class WeatherStation implements Subject{
    observerList : Observer[] = [];
    temperatureList : number[] = [];
    temp : number;
    humidity : number;
    pressure : number;
    avgTemp  : number;
    
    subsribe(o: Observer): void {
        this.observerList.push(o);
    }
    unsubsribe(o: Observer): void {
       this.observerList = this.observerList.filter(ofind => ofind !== o);
    }

     notify(): void {
        this.observerList.forEach(ob => 
            ob.update(this.temp, this.humidity, this.pressure, this.avgTemp)
        )
    }

    setMeasurements(temperature : number, humidity : number, pressure: number):void{
        this.temp = temperature;
        this.humidity = humidity;
        this.pressure = pressure;

        this.temperatureList.push(this.temp);
        this.StatisticsDisplay();
        this.notify();
    }

    CurrentConditionsDisplay(){
        console.log(`${this.temp} is the temperature, ${this.humidity} is the humidity, ${this.pressure} is the pressure`)
    }

    StatisticsDisplay(){
        const tempTotal = this.temperatureList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0)
          const tempLen = this.temperatureList.length;

          this.avgTemp = tempTotal/tempLen;
    }
}


class Station1 implements Observer{
    update(temp : number, humidity : number, pressure : number, avgTemp : number): void {
        console.log(`From station 1 the current temp is ${temp}, and humidity is ${humidity}, and pressure is  ${pressure} and average temperature is ${avgTemp}`)
    }
}

class Station2 implements Observer{
    update(temp : number, humidity : number, pressure : number, avgTemp : number): void {
        console.log(`From station 2 the current temp is ${temp}, and humidity is ${humidity}, and pressure is  ${pressure} and average temperature is ${avgTemp}`)
    }
}

class TestWeatherStation {
    static runTests() {
        console.log("Running WeatherStation Tests...");

        console.log("\nTest 1: Subscribing and notifying observers");
        const weather = new WeatherStation();
        const station1 = new Station1();
        const station2 = new Station2();

        weather.subsribe(station1);
        weather.setMeasurements(30, 80, 40); 

        weather.subsribe(station2);
        weather.setMeasurements(32, 85, 42);

        // Test 2: Unsubscribing an observer
        console.log("\nTest 2: Unsubscribing an observer");
        weather.unsubsribe(station1);
        weather.setMeasurements(35, 90, 45);


        console.log("\nTest 3: Average temperature calculation");
        const weather2 = new WeatherStation();
        const station3 = new Station1();
        weather2.subsribe(station3);

        weather2.setMeasurements(25, 70, 30); 
        weather2.setMeasurements(30, 75, 35); 
        weather2.setMeasurements(35, 80, 40); 

        // Test 4: No observers subscribed
        console.log("\nTest 4: No observers subscribed");
        const weather3 = new WeatherStation();
        weather3.setMeasurements(28, 78, 38);

        console.log("\nAll tests completed.");
    }
}

// Run the tests
TestWeatherStation.runTests();




