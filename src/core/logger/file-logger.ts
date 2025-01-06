import * as fs from 'fs';
import * as path from 'path';
import {Injectable} from 'light-kite';
import ILogger from './logger.interface';

@Injectable()
class FileLogger implements ILogger {
  private readonly logFilePath: string;

  constructor(logFileName: string = 'application.log') {
    this.logFilePath = path.resolve(process.cwd(), logFileName);
  }
  
  logInfo(message: string): void {
    this.logToFile('INFO', message);
  }

  logWarning(message: string): void {
    this.logToFile('WARNING', message);
  }

  logError(message: string): void {
    this.logToFile('ERROR', message);
  }

  private logToFile(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;

    fs.appendFile(this.logFilePath, formattedMessage, (err) => {
      if (err) {
        console.error(`Failed to write log: ${err.message}`);
      }
    });
  }
}

export default FileLogger;
