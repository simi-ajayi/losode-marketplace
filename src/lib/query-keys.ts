export const queryKeys = {
  products: ["products"] as const,
  categories: ["categories"] as const,
  product: (id: number) => ["product", id] as const,
};
