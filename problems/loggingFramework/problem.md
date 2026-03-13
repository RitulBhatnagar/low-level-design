# Designing a Logging Framework

## Requirements

### Functional Requirement
 - Logging Framework should support [LOG_LEVEL] - INFO, DEBUG, ERROR, WARN, FATAL 
 - Format for logs will be timestamp - log level - message content
 - The framework should support multiple output destinations, such as console, file, and database.
 - It should be extensible to accommodate new log levels and output destinations in the future.
 - It should provide a configuration mechanism to set the log level and output destination.

### Non Functional Requirement
 - The logging framework should be thread-safe to handle concurrent logging from multiple threads.

-------

## Core Entites
1. `LogMessage` -> class
2.  `LogAppender` - > interface for different type of output destination
3. `consoleAppender`, `databaseAppender`, `fileAppender` -> classses that implments appending of the logs to their respective destinations
4. `LoggerConfig` -> class that holds the configuration seetings for logger
5. `Logger` ->  main class for logging functionality
6.   `Log Level` -> Enum (INFO,DEBUG,ERROR, WARN, FATAL)


## Class Diagram

```
Logger (Singleton)
 |- config : LoggerConfig
 |- log(level, message)
 |- info(message)
 |- error(message)
 |- debug(message)
 |- warn(message)
 |- fatal(message)

 LogMessage
 |- logLevel
 |- timestamp
 |- message
 |- format()

 LogAppender(Inteface)
 |- append(logMessage)

 consoleAppender implements LogAppender
 |- append(logMessage)
 
 databaseAppender implements LogAppender
 |-dbConnection
 |- createConnection()
 |- append(logMessage)

 fileAppender implements LogAppender
 |- filePath
 |- append(logMessage)

 LoggerConfig
 |- logLevel : LogLevel
 |- appenders : List<LogAppender>
 |- addAppenders()
 |- removeAppenders()
```
