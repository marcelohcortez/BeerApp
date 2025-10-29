import {
  getBeer,
  getBeerList,
  getRandomBeerList,
  searchBeerList,
  getBeerMetaData,
} from "../beer";
import {
  createMockBeer,
  createMockBeerList,
  createMockMeta,
} from "../../__tests__/mocks/mockData";

// Mock axios at the module level
jest.mock("axios", () => ({
  get: jest.fn(),
}));

import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Beer API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBeer", () => {
    it("should fetch a single beer by ID", async () => {
      const beerId = "test-beer-1";
      const mockBeer = createMockBeer({ id: beerId });

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeer,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getBeer(beerId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/${beerId}`
      );
      expect(response.data).toHaveProperty("id", beerId);
      expect(response.data).toHaveProperty("name");
      expect(response.data).toHaveProperty("brewery_type");
    });

    it("should handle API errors when fetching beer", async () => {
      const errorResponse = {
        response: { status: 404, data: { message: "Beer not found" } },
        request: {},
        message: "Beer not found",
        isAxiosError: true,
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(getBeer("invalid-id")).rejects.toMatchObject({
        response: { status: 404 },
        message: "Beer not found",
      });
    });
  });

  describe("getBeerList", () => {
    it("should fetch beer list without parameters", async () => {
      const mockBeerList = createMockBeerList(10);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getBeerList();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/`,
        { params: undefined }
      );
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(10);
    });

    it("should fetch beer list with parameters", async () => {
      const params = { page: 2, per_page: 20, sort: "asc" as const };
      const mockBeerList = createMockBeerList(20);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getBeerList(params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/`,
        { params }
      );
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("should handle API errors when fetching beer list", async () => {
      const errorResponse = {
        response: { status: 500, data: { message: "Server Error" } },
        request: {},
        message: "Server Error",
        isAxiosError: true,
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(getBeerList()).rejects.toMatchObject({
        response: { status: 500 },
        message: "Server Error",
      });
    });
  });

  describe("getRandomBeerList", () => {
    it("should fetch random beer list with default size", async () => {
      const mockBeerList = createMockBeerList(3);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getRandomBeerList();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/random`,
        { params: { size: 3 } }
      );
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(3);
    });

    it("should fetch random beer list with custom size", async () => {
      const size = 10;
      const mockBeerList = createMockBeerList(size);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getRandomBeerList(size);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/random`,
        { params: { size } }
      );
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(size);
    });
  });

  describe("searchBeerList", () => {
    it("should search beer list with default mode", async () => {
      const query = "test brewery";
      const mockBeerList = createMockBeerList(5);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await searchBeerList(query);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/search`,
        { params: { query } }
      );
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("should search beer list with autocomplete mode", async () => {
      const query = "test brewery";
      const mockBeerList = createMockBeerList(5);

      mockedAxios.get.mockResolvedValueOnce({
        data: mockBeerList,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await searchBeerList(query, true);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/autocomplete`,
        { params: { query } }
      );
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe("getBeerMetaData", () => {
    it("should fetch beer metadata without parameters", async () => {
      const mockMeta = createMockMeta();

      mockedAxios.get.mockResolvedValueOnce({
        data: mockMeta,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getBeerMetaData();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/meta`,
        { params: undefined }
      );
      expect(response.data).toHaveProperty("total");
      expect(response.data).toHaveProperty("page");
      expect(response.data).toHaveProperty("per_page");
    });

    it("should fetch beer metadata with parameters", async () => {
      const params = { by_state: "california" };
      const mockMeta = createMockMeta();

      mockedAxios.get.mockResolvedValueOnce({
        data: mockMeta,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

      const response = await getBeerMetaData(params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API}breweries/meta`,
        { params }
      );
    });
  });
});
