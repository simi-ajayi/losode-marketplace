"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,
  });
}
