"use client";

import { Input, Select, Slider } from "antd";

import type { Category } from "@/types/product";

const { Search } = Input;

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategoryId: number | null;
  priceRange: [number, number];
  maxPrice: number;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | null) => void;
  onPriceChange: (value: [number, number]) => void;
}

export function ProductFilters({
  searchTerm,
  selectedCategoryId,
  priceRange,
  maxPrice,
  categories,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
}: ProductFiltersProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#ede3d6] bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr]">
        <Search
          allowClear
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name"
          size="large"
          className="w-full"
        />

        <Select
          allowClear
          size="large"
          placeholder="Filter by category"
          className="w-full"
          value={selectedCategoryId ?? undefined}
          onChange={(value) => onCategoryChange(value ?? null)}
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-[#544a42]">
          <span>Price range</span>
          <span>
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>

        <Slider
          range
          min={0}
          max={Math.max(maxPrice, 1000)}
          value={priceRange}
          onChange={(value) => onPriceChange(value as [number, number])}
        />
      </div>
    </section>
  );
}
