import { logger, performanceLogger, errorLogger, buildLogger } from "../logger";

// Mock console methods
const consoleSpy = {
  debug: jest.spyOn(console, "debug").mockImplementation(() => {}),
  info: jest.spyOn(console, "info").mockImplementation(() => {}),
  log: jest.spyOn(console, "log").mockImplementation(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
  group: jest.spyOn(console, "group").mockImplementation(() => {}),
  groupEnd: jest.spyOn(console, "groupEnd").mockImplementation(() => {}),
  time: jest.spyOn(console, "time").mockImplementation(() => {}),
  timeEnd: jest.spyOn(console, "timeEnd").mockImplementation(() => {}),
};

// Store original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

describe("Logger Utility", () => {
  afterEach(() => {
    // Clear all mocks
    Object.values(consoleSpy).forEach((spy) => spy.mockClear());

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterAll(() => {
    // Restore all console methods
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
  });

  describe("Development Environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should log in development environment", () => {
      logger.log("Test message");
      expect(consoleSpy.log).toHaveBeenCalledWith("Test message");
    });

    it("should log debug messages in development", () => {
      logger.debug("Debug message");
      expect(consoleSpy.debug).toHaveBeenCalledWith("Debug message");
    });

    it("should log warnings in development", () => {
      logger.warn("Warning message");
      expect(consoleSpy.warn).toHaveBeenCalledWith("Warning message");
    });

    it("should log errors in development", () => {
      logger.error("Error message");
      expect(consoleSpy.error).toHaveBeenCalledWith("Error message");
    });
  });

  describe("Production Environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("should not log general messages in production", () => {
      logger.log("Test message");
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("should not log debug messages in production", () => {
      logger.debug("Debug message");
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it("should not log performance messages in production", () => {
      performanceLogger.log("Performance message");
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("should still log errors in production with errorLogger", () => {
      errorLogger.error("Error message");
      expect(consoleSpy.error).toHaveBeenCalledWith("Error message");
    });
  });

  describe("Specialized Loggers", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should work with performance logger", () => {
      performanceLogger.log("Performance metric");
      expect(consoleSpy.log).toHaveBeenCalledWith("Performance metric");
    });

    it("should work with error logger", () => {
      errorLogger.error("Error occurred");
      expect(consoleSpy.error).toHaveBeenCalledWith("Error occurred");
    });

    it("should work with build logger", () => {
      buildLogger.info("Build information");
      expect(consoleSpy.info).toHaveBeenCalledWith("Build information");
    });
  });

  describe("Logger Methods", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should support group logging", () => {
      logger.group("Test Group");
      expect(consoleSpy.group).toHaveBeenCalledWith("Test Group");
    });

    it("should support groupEnd logging", () => {
      logger.groupEnd();
      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });

    it("should support time logging", () => {
      logger.time("timer");
      expect(consoleSpy.time).toHaveBeenCalledWith("timer");
    });

    it("should support timeEnd logging", () => {
      logger.timeEnd("timer");
      expect(consoleSpy.timeEnd).toHaveBeenCalledWith("timer");
    });

    it("should handle multiple arguments", () => {
      logger.log("Message", { data: "test" }, 123);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        "Message",
        { data: "test" },
        123
      );
    });
  });
});
