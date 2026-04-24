"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useProduct(productId: number) {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId),
    staleTime: 1000 * 60 * 5,
  });
}
