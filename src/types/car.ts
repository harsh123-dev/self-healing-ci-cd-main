// Car data model matching the API specification

export interface Seller {
  company: string;
  location: string;
  is_small_brand: boolean;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: "INR" | "USD" | "EUR";
  category: "hatchback" | "sedan" | "suv" | "luxury" | "sports" | "ev" | "hybrid";
  mileage: string;
  power: string;
  transmission: "manual" | "auto";
  images: string[];
  thumbnail: string;
  gltfModelUrl: string | null;
  description: string;
  features: string[];
  seller: Seller;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  page: number;
  pageSize: number;
  make?: string[];
  minPrice?: number;
  maxPrice?: number;
  currency?: "INR" | "USD" | "EUR";
  category?: string[];
  yearFrom?: number;
  yearTo?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "year_desc" | "year_asc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MakeCount {
  make: string;
  count: number;
}

export type CategoryType = Car["category"];
export type CurrencyType = Car["currency"];
export type TransmissionType = Car["transmission"];
