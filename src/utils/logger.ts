/**
 * Environment-aware logging utility
 * Provides console logging that can be disabled in production builds
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabledInProduction: boolean;
  enabledInDevelopment: boolean;
  minLevel: LogLevel;
}

class Logger {
  private config: LoggerConfig;
  private readonly levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabledInProduction: false,
      enabledInDevelopment: true,
      minLevel: "debug",
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const isProduction = process.env.NODE_ENV === "production";
    const isDevelopment = process.env.NODE_ENV === "development";

    // Check if logging is enabled for current environment
    if (isProduction && !this.config.enabledInProduction) {
      return false;
    }
    if (isDevelopment && !this.config.enabledInDevelopment) {
      return false;
    }

    // Check if level meets minimum threshold
    return this.levels[level] >= this.levels[this.config.minLevel];
  }

  debug(...args: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog("info")) {
      console.info(...args);
    }
  }

  log(...args: any[]): void {
    if (this.shouldLog("info")) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog("error")) {
      console.error(...args);
    }
  }

  group(label?: string): void {
    if (this.shouldLog("info")) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog("info")) {
      console.groupEnd();
    }
  }

  time(label?: string): void {
    if (this.shouldLog("debug")) {
      console.time(label);
    }
  }

  timeEnd(label?: string): void {
    if (this.shouldLog("debug")) {
      console.timeEnd(label);
    }
  }
}

// Create logger instances for different purposes
export const logger = new Logger();

export const performanceLogger = new Logger({
  enabledInProduction: false,
  enabledInDevelopment: true,
  minLevel: "info",
});

export const errorLogger = new Logger({
  enabledInProduction: true, // Errors should always be logged
  enabledInDevelopment: true,
  minLevel: "error",
});

export const buildLogger = new Logger({
  enabledInProduction: false,
  enabledInDevelopment: true,
  minLevel: "info",
});

export default logger;
