"use client";

import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => getProducts(80),
    staleTime: 1000 * 60 * 5,
  });
}
