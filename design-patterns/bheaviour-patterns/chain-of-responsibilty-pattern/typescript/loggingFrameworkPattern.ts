enum LogLevel{
    DEBUG = 1,
    INFO = 2,
    ERROR = 4,
    WARN = 3
}

class LogMessage{
    level : number;
    message : string;

    constructor(level : number, message : string){
        this.level = level;
        this.message  = message;
    }
}


interface Logger{
    setNext(next : Logger):void;
    log(logMessage : LogMessage):void;
}

abstract class BaseLogger implements Logger{

    protected next : Logger | null = null;

    setNext(next: Logger): void {
        this.next = next;
    }

    protected forward(logMessage : LogMessage) : void{
        if(this.next){
            this.next.log(logMessage);
        }
    }

    abstract log(log:LogMessage) : void
}

class DebugLogger extends BaseLogger{
    log(log : LogMessage) : void{
        if(log.level >= LogLevel.DEBUG){
            console.log(`[DEBUG] : ${log.message}`)
        }
        this.forward(log);
    }
}

class InfoLogger extends BaseLogger{
    log(log : LogMessage) : void{
        if(log.level >= LogLevel.INFO){
            console.log(`[INFO] : ${log.message}`)
        }
        this.forward(log);
    }
}

class WarnLogger extends BaseLogger{
    log(log : LogMessage) : void{
        if(log.level >= LogLevel.WARN){
            console.log(`[Warn] : ${log.message}`)
        }
        this.forward(log);
    }
}


class ErrorLogger extends BaseLogger{
    log(log : LogMessage) : void{
        if(log.level >= LogLevel.ERROR){
            console.log(`[ERROR] : ${log.message}`)
        }
        this.forward(log);
    }
}

const debug = new DebugLogger();
const info = new InfoLogger();
const warn = new WarnLogger();
const error = new ErrorLogger();

debug.setNext(info);
info.setNext(warn);
warn.setNext(error);


const message = new LogMessage(LogLevel.ERROR, "Something looks suspicious");

debug.log(message);