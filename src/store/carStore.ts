// Global state management for the car marketplace using Zustand

import { create } from "zustand";
import { Car, CarFilters, PaginatedResponse, MakeCount } from "@/types/car";
import * as carService from "@/services/carService";

interface CarStore {
  cars: Car[];
  selectedCar: Car | null;
  makes: MakeCount[];
  categories: string[];
  priceRange: { min: number; max: number };
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: CarFilters;

  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  fetchMakes: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPriceRange: (currency?: "INR" | "USD" | "EUR") => Promise<void>;
  setFilters: (filters: Partial<CarFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  createCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => Promise<Car>;
  updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  clearSelectedCar: () => void;
}

const defaultFilters: CarFilters = {
  page: 1,
  pageSize: 12,
  sort: "price_asc",
};

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  selectedCar: null,
  makes: [],
  categories: [],
  priceRange: { min: 0, max: 0 },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  },
  filters: { ...defaultFilters },

  fetchCars: async () => {
    set({ loading: true, error: null });

    try {
      const response = await carService.getCars(get().filters);

      set({
        cars: response.data,
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch cars";
      set({ error: message, loading: false });
      console.error(message);
    }
  },

  fetchCarById: async (id: string) => {
    set({ loading: true, error: null, selectedCar: null });

    try {
      const car = await carService.getCarById(id);
      set({ selectedCar: car, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch car";
      set({ error: message, loading: false });
      console.error(message);
    }
  },

  fetchMakes: async () => {
    try {
      const makes = await carService.getMakes();
      set({ makes });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await carService.getCategories();
      set({ categories });
    } catch (error) {
      console.error(error);
    }
  },

  fetchPriceRange: async (currency = "INR") => {
    try {
      const priceRange = await carService.getPriceRange(currency);
      set({ priceRange });
    } catch (error) {
      console.error(error);
    }
  },

  setFilters: (newFilters: Partial<CarFilters>) => {
    const updatedFilters = { ...get().filters, ...newFilters, page: 1 };
    set({ filters: updatedFilters });
    get().fetchCars();
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    get().fetchCars();
  },

  setPage: (page: number) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchCars();
  },

  createCar: async (carData) => {
    set({ loading: true, error: null });

    try {
      const token = getAuthToken();
      const newCar = await carService.createCar(carData, token || "");

      set({ loading: false });
      await get().fetchCars();
      return newCar;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create car";
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateCar: async (id: string, updates: Partial<Car>) => {
    set({ loading: true, error: null });

    try {
      const token = getAuthToken();
      await carService.updateCar(id, updates, token || "");

      set({ loading: false });
      await get().fetchCars();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update car";
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteCar: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const token = getAuthToken();
      await carService.deleteCar(id, token || "");

      set({ loading: false });
      await get().fetchCars();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete car";
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearSelectedCar: () => {
    set({ selectedCar: null });
  },
}));

