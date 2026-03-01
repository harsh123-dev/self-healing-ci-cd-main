const BASE_URL = import.meta.env.VITE_CATALOG_API_URL;

export async function fetchCars(filters) {
    if (!BASE_URL) {
        console.warn("Using mock catalog service");
        return mockFetchCars(filters);
    }
    return fetch(`${BASE_URL}/cars`).then(r => r.json());
}

if (!import.meta.env.VITE_CATALOG_API_URL) {
    console.error("[catalog] Missing API URL");
}
