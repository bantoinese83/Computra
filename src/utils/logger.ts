/**
 * Structured logging utility for Computra
 * Provides consistent, structured logging with context and severity levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const entry = this.formatLogEntry(level, message, context, error);

    // In production, you might want to send logs to a service
    // For now, we'll use console with structured output
    const logMethod = level === LogLevel.ERROR ? console.error : console.log;
    logMethod(JSON.stringify(entry, null, 2));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

// Export singleton instance
export const logger = new Logger();

