interface ILogger {
  logInfo(message: string): void;
  logWarning(message: string): void;
  logError(message: string): void;
}

export default ILogger;