import { Car, CarFilters, PaginatedResponse, MakeCount } from "@/types/car";

const API_BASE = "http://13.204.159.55:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// GET CARS
export async function getCars(filters: CarFilters): Promise<PaginatedResponse<Car>> {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.pageSize) params.append("pageSize", String(filters.pageSize));
  if (filters.search) params.append("search", filters.search);
  if (filters.make?.length) params.append("make", filters.make.join(","));
  if (filters.sort) params.append("sort", filters.sort);

  const response = await fetch(`${API_BASE}/api/cars?${params}`);

  if (!response.ok) throw new Error("Failed to fetch cars");

  return response.json();
}

// GET SINGLE CAR
export async function getCarById(id: string): Promise<Car | null> {
  const response = await fetch(`${API_BASE}/api/cars/${id}`);

  if (!response.ok) return null;

  return response.json();
}

// CREATE CAR (PROTECTED)
export async function createCar(
  carData: Omit<Car, "id" | "createdAt" | "updatedAt">
): Promise<Car> {
  const response = await fetch(`${API_BASE}/api/cars`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
}

// UPDATE CAR (PROTECTED)
export async function updateCar(
  id: string,
  updates: Partial<Car>
): Promise<Car> {
  const response = await fetch(`${API_BASE}/api/cars/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
}

// DELETE CAR (PROTECTED)
export async function deleteCar(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/cars/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return true;
}

// GET MAKES
export async function getMakes(): Promise<MakeCount[]> {
  const response = await fetch(`${API_BASE}/api/filters/makes`);

  if (!response.ok) throw new Error("Failed to fetch makes");

  return response.json();
}

// GET CATEGORIES
export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/api/filters/categories`);

  if (!response.ok) throw new Error("Failed to fetch categories");

  return response.json();
}

// GET PRICE RANGE
export async function getPriceRange(
  currency: "INR" | "USD" | "EUR" = "INR"
): Promise<{ min: number; max: number }> {
  const response = await fetch(
    `${API_BASE}/api/filters/price-range?currency=${currency}`
  );

  if (!response.ok) throw new Error("Failed to fetch price range");

  return response.json();
}
