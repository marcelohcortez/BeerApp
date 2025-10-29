// Mock console.error to avoid cluttering test output
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

// Create a mock axios error checker
const createAxiosError = (response?: any, request?: any) => ({
  isAxiosError: true,
  response,
  request,
  message: response
    ? `Request failed with status code ${response.status}`
    : "Network Error",
});

// Mock the axios module
jest.mock("axios", () => ({
  isAxiosError: jest.fn(),
}));

import handle from "../error";
import axios from "axios";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Error Handler", () => {
  afterEach(() => {
    consoleSpy.mockClear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("Axios Errors", () => {
    it("should handle axios error with response", () => {
      const axiosError = createAxiosError({
        status: 404,
        data: { message: "Not found" },
      });

      mockedAxios.isAxiosError.mockReturnValueOnce(true);
      handle(axiosError);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Server returned an error with status code: 404"
      );
    });

    it("should handle axios error without response (network error)", () => {
      const axiosError = createAxiosError(undefined, {});

      mockedAxios.isAxiosError.mockReturnValueOnce(true);
      handle(axiosError);

      expect(consoleSpy).toHaveBeenCalledWith("No response from the server");
    });

    it("should handle axios library internal error", () => {
      const axiosError = createAxiosError();

      mockedAxios.isAxiosError.mockReturnValueOnce(true);
      handle(axiosError);

      expect(consoleSpy).toHaveBeenCalledWith("Axios library internal error");
    });
  });

  describe("Non-Axios Errors", () => {
    it("should handle generic errors", () => {
      const genericError = new Error("Something went wrong");

      mockedAxios.isAxiosError.mockReturnValueOnce(false);
      handle(genericError);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Internal code error, we did something wrong"
      );
    });

    it("should handle non-error objects", () => {
      const unknownError = "String error";

      mockedAxios.isAxiosError.mockReturnValueOnce(false);
      handle(unknownError);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Internal code error, we did something wrong"
      );
    });

    it("should handle null/undefined errors", () => {
      mockedAxios.isAxiosError.mockReturnValueOnce(false);
      handle(null);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Internal code error, we did something wrong"
      );
    });
  });
});
