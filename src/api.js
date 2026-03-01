export const API_BASE = "http://backend:3000";

export const getCars = async () => {
  const res = await fetch(`${API_BASE}/api/cars`);
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  return res.json();
};

