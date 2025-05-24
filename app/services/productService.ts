import { Product } from "@/types/product";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/get-products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}
