import {
  getStringForApi,
  capitalize,
  cleanPhoneNumber,
} from "../../utils/string";

describe("String Utils", () => {
  describe("getStringForApi", () => {
    it("should convert string to lowercase and replace spaces with underscores", () => {
      expect(getStringForApi("Hello World")).toBe("hello_world");
      expect(getStringForApi("Test String Here")).toBe("test_string_here");
      expect(getStringForApi("UPPERCASE")).toBe("uppercase");
    });

    it("should handle empty strings", () => {
      expect(getStringForApi("")).toBe("");
    });

    it("should handle strings with multiple spaces", () => {
      expect(getStringForApi("Multiple   Spaces")).toBe("multiple___spaces");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter and lowercase the rest", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
      expect(capitalize("tEST")).toBe("Test");
    });

    it("should handle empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle undefined input", () => {
      expect(capitalize(undefined)).toBe("");
    });

    it("should handle single character strings", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("Z")).toBe("Z");
    });
  });

  describe("cleanPhoneNumber", () => {
    it("should remove spaces, plus signs, hyphens, and parentheses", () => {
      expect(cleanPhoneNumber("+1-555-123-4567")).toBe("15551234567");
      expect(cleanPhoneNumber("555 123 4567")).toBe("5551234567");
      expect(cleanPhoneNumber("+1 (555) 123-4567")).toBe("15551234567");
    });

    it("should handle undefined input", () => {
      expect(cleanPhoneNumber(undefined)).toBe("");
    });

    it("should handle empty strings", () => {
      expect(cleanPhoneNumber("")).toBe("");
    });

    it("should handle numbers without special characters", () => {
      expect(cleanPhoneNumber("5551234567")).toBe("5551234567");
    });
  });
});
