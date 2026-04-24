import type { Category, Product } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_PLATZI_API_URL ?? "https://api.escuelajs.co/api/v1";

async function fetchFromApi<T>(path: string, query?: Record<string, string | number>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getProducts(limit = 60) {
  return fetchFromApi<Product[]>("/products", { offset: 0, limit });
}

export async function getProductById(id: number) {
  return fetchFromApi<Product>(`/products/${id}`);
}

export async function getCategories() {
  return fetchFromApi<Category[]>("/categories");
}
