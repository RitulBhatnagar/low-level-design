from enum import Enum
from datetime import datetime
from abc import ABC, abstractmethod

class LogLevel(Enum):
    DEBUG = 1
    INFO = 2
    ERROR = 3
    WARN = 4
    FATAL = 5

class AppendersType(Enum):
    CONSOLE = 1
    DATABASE = 2
    FILE = 3

class LogMessage:
    def __init__(self, logLevel : LogLevel, message : str):
        self.logLevel = logLevel
        self.message = message
        self.timestamp = datetime.now()


class LogFormatter:
    def format(self, log_message : LogMessage) -> str:
        return f"|{log_message.timestamp.strftime('%Y-%m-%d %H:%M:%S')} | {log_message.logLevel.name} | {log_message.message}"

class LogAppender(ABC):
    @abstractmethod
    def append(self, message:str)->None:
        pass

class ConsoleAppender(LogAppender):
    def append(self, message) -> None:
        print(message)

class FileAppender(LogAppender):
    def append(self, message) -> None:
        print(message)

class DatabaseAppender(LogAppender):
    def append(self, message) -> None:
        print(f"[DB] {message}")


class LoggerConfig:
    appenders : list[LogAppender]

    def __init__(self):
        self.appenders = []

    def addAppenders(self, appenderType : AppendersType):
        if appenderType == AppendersType.CONSOLE:
            self.appenders.append(ConsoleAppender())
        elif appenderType == AppendersType.DATABASE:
            self.appenders.append(DatabaseAppender())
        else:
            self.appenders.append(FileAppender())
    
    def removeAppenders(self, appenderType : AppendersType):
        if appenderType == AppendersType.CONSOLE:
            self.appenders = [a for a in self.appenders if not isinstance(a, ConsoleAppender)]
        elif appenderType == AppendersType.FILE:
            self.appenders = [a for a in self.appenders if not isinstance(a, FileAppender)]
        else:
            self.appenders = [a for a in self.appenders if not isinstance(a, DatabaseAppender)]


class Logger:
    _instance = None

    def __init__(self):
        self.log_message = LogMessage
        self.config = LoggerConfig()
        self.formatter = LogFormatter()
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = Logger()
        return cls._instance
    
    def _logging(self, level : LogLevel, message : str):
        loggingmessage = self.log_message(level, message)
        formatted = self.formatter.format(loggingmessage)
        for appender in self.config.appenders:
            appender.append(formatted)

    def info(self, message : str):
        self._logging(LogLevel.INFO, message)
    
    def error(self, message : str):
        self._logging(LogLevel.ERROR, message)
    
    def fatal(self, message : str):
        self._logging(LogLevel.FATAL, message)
    
    def warn(self, message : str):
        self._logging(LogLevel.WARN, message)
    
    def debug(self, message : str):
        self._logging(LogLevel.DEBUG, message)


# ── Tests ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    logger = Logger.get_instance()

    # 1. Add console + file appenders and log at each level
    print('--- Test 1: all log levels ---')
    logger.config.addAppenders(AppendersType.CONSOLE)
    logger.config.addAppenders(AppendersType.FILE)
    logger.info('server started')
    logger.debug('connecting to db')
    logger.warn('low memory')
    logger.error('request failed')
    logger.fatal('system crash')

    # 2. Singleton check
    print('\n--- Test 2: singleton ---')
    logger2 = Logger.get_instance()
    print('same instance:', logger is logger2)  # True

    # 3. removeAppenders
    print('\n--- Test 3: remove file appender ---')
    logger.config.addAppenders(AppendersType.DATABASE)
    print('appenders before remove:', len(logger.config.appenders))  # 3
    logger.config.removeAppenders(AppendersType.FILE)
    print('appenders after remove:', len(logger.config.appenders))   # 2
    logger.info('only console and db now')