class Lighs{
    turnOn(){
        console.log("Lights turned on");
    }
    turnOff(){
        console.log("Lights turned off");
    }
}

class Thermostat{
    setEcoMode(){
        console.log("Themostat set to eco mode with temperature of 18C");
    }

    setComfortMode(){
        console.log("Themostat set to eco mode with temperature of 22C");
    }
}

class SecuritySystem{
    arm(){
        console.log("Security system armed");
    }

    disarm(){
        console.log("Security system disarmed");
    }
}


class SystemFacade{
    private lights: Lighs;
    private thermostat: Thermostat;
    private securitySystem: SecuritySystem;

    constructor(){
        this.lights = new Lighs();
        this.thermostat = new Thermostat();
        this.securitySystem = new SecuritySystem();
    }

    leaveHome(){
        this.lights.turnOff();
        this.thermostat.setEcoMode();
        this.securitySystem.arm();
    }

    arriveHome(){
        this.lights.turnOn();
        this.thermostat.setComfortMode();
        this.securitySystem.disarm();
    }
}

const system = new SystemFacade();
console.log("Leaving home...");
system.leaveHome();

console.log("\nArriving home...");
system.arriveHome();