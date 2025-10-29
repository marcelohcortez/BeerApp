import { Beer, Meta } from "../../types";

// Mock beer data factory
export const createMockBeer = (overrides: Partial<Beer> = {}): Beer => ({
  id: "mock-beer-1",
  name: "Mock Brewery",
  brewery_type: "micro",
  address_1: "123 Mock Street",
  address_2: "",
  address_3: "",
  city: "Mock City",
  state_province: "Mock State",
  postal_code: "12345",
  country: "United States",
  longitude: "-74.0059",
  latitude: "40.7128",
  phone: "555-0123",
  website_url: "https://mockbrewery.com",
  state: "Mock State",
  street: "123 Mock Street",
  ...overrides,
});

// Mock beer list factory
export const createMockBeerList = (count: number = 3): Beer[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockBeer({
      id: `mock-beer-${index + 1}`,
      name: `Mock Brewery ${index + 1}`,
      brewery_type: index % 2 === 0 ? "micro" : "regional",
    })
  );
};

// Mock meta data factory
export const createMockMeta = (overrides: Partial<Meta> = {}): Meta => ({
  total: "100",
  page: "1",
  per_page: "10",
  ...overrides,
});

// Mock API response factory
export const createMockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
});

// Mock error response factory
export const createMockErrorResponse = (
  status: number = 500,
  message: string = "Internal Server Error"
) => ({
  response: {
    status,
    data: { message },
    statusText: message,
  },
  request: {},
  message,
  isAxiosError: true,
});

export default {
  createMockBeer,
  createMockBeerList,
  createMockMeta,
  createMockApiResponse,
  createMockErrorResponse,
};
