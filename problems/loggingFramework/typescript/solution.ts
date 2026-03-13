enum LOGLEVEL{
    INFO='INFO',
    DEBUG='DEBUG',
    ERROR='ERROR',
    WARN='WARN',
    FATAL='FATAL'
}
enum AppendersType{
    CONSOLE='Console',
    DATABASE='Database',
    FILE='File'
}


interface LogAppender{
    append(message:string) : void
}

class logMessage{
  logLevel : LOGLEVEL
  timestamp : string
  message : string;

  format(logLevel : LOGLEVEL, timestamp:string, message : string){
    this.logLevel = logLevel;
    this.timestamp = timestamp;
    this.message = message
    return `${this.timestamp} ${this.logLevel} ${this.message}`
  }
}

class ConsoleAppender implements LogAppender{
    append(message: string): void {
        console.log(message)
    }
}


class FileAppender implements LogAppender{
    append(message: string): void {
        console.log(message);
    }
}

class DatabaseAppender implements LogAppender{
    append(message: string): void {
        console.log(`[DB] ${message}`);
    }
}

class LoggerConfig{
    logLevel : LOGLEVEL
    appenders : LogAppender[] = []

    addAppenders(appenderType : AppendersType){
        if(appenderType===AppendersType.CONSOLE){
            this.appenders.push(new ConsoleAppender());
        }
        else if(appenderType===AppendersType.DATABASE){
            this.appenders.push(new DatabaseAppender());
        }
        else{
            this.appenders.push(new FileAppender());
        }
    }


    removeAppenders(appenderType : AppendersType){
        if(appenderType===AppendersType.CONSOLE){
            this.appenders = this.appenders.filter(
                (appender) => !(appender instanceof ConsoleAppender)
            )
        }
            else if(appenderType===AppendersType.FILE){
                this.appenders = this.appenders.filter(
                    (appender) => !(appender instanceof FileAppender)
                )
            }
        else{
                this.appenders = this.appenders.filter(
                    (appender) => !(appender instanceof DatabaseAppender)
                )
            
        }
    }
}


class Logger{
    config : LoggerConfig
    logmessage : logMessage;
    private static instance : Logger

    private constructor(){
        this.logmessage = new logMessage();
        this.config = new LoggerConfig();
    }

    static getInstance(){
        if(!Logger.instance){
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private logging(level : LOGLEVEL, message : string){
        const formatted = this.logmessage.format(level, new Date().toISOString(), message);
        this.config.appenders.map((appender) => appender.append(formatted));
    }

    info(message:string){
        this.logging(LOGLEVEL.INFO, message);
    }
    error(message:string){
        this.logging(LOGLEVEL.ERROR, message);
    }
    fatal(message : string){
        this.logging(LOGLEVEL.FATAL, message);
    }
    warn(message : string){
        this.logging(LOGLEVEL.WARN, message)
    }
    debug(message : string){
        this.logging(LOGLEVEL.DEBUG,message);
    }
}

// ── Tests ────────────────────────────────────────────────────────────────────
const logger = Logger.getInstance();

// 1. Add console + file appenders and log at each level
console.log('--- Test 1: all log levels ---');
logger.config.addAppenders(AppendersType.CONSOLE);
logger.config.addAppenders(AppendersType.FILE);
logger.info('server started');
logger.debug('connecting to db');
logger.warn('low memory');
logger.error('request failed');
logger.fatal('system crash');

// 2. Singleton check
console.log('\n--- Test 2: singleton ---');
const logger2 = Logger.getInstance();
console.log('same instance:', logger === logger2);  // true

// 3. removeAppenders
console.log('\n--- Test 3: remove file appender ---');
logger.config.addAppenders(AppendersType.DATABASE);
console.log('appenders before remove:', logger.config.appenders.length); // 3
logger.config.removeAppenders(AppendersType.FILE);
console.log('appenders after remove:', logger.config.appenders.length);  // 2
logger.info('only console and db now');