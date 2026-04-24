"use client";

import { useMemo, useState } from "react";

import { Slider } from "antd";

import type { Category } from "@/types/product";
import { ProductFiltersSkeleton } from "@/components/products/product-loading-state";

type FilterSection =
  | "category"
  | "designers"
  | "size"
  | "occasion"
  | "fit"
  | "returns"
  | "color"
  | "price";

interface ProductFiltersProps {
  selectedCategoryId: number | null;
  priceRange: [number, number];
  maxPrice: number;
  itemCount: number;
  isLoading?: boolean;
  categories: Category[];
  onCategoryChange: (value: number | null) => void;
  onPriceChange: (value: [number, number]) => void;
  onClearAll: () => void;
}

export function ProductFilters({
  selectedCategoryId,
  priceRange,
  maxPrice,
  itemCount,
  isLoading = false,
  categories,
  onCategoryChange,
  onPriceChange,
  onClearAll,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<FilterSection, boolean>>({
    category: true,
    designers: true,
    size: true,
    occasion: true,
    fit: true,
    returns: true,
    color: true,
    price: true,
  });

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const sliderMax = Math.max(maxPrice, priceRange[1], 1000);

  const toggleSection = (section: FilterSection) => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const updateMinPrice = (value: string) => {
    const numericValue = Number(value);
    const safeValue = Number.isFinite(numericValue)
      ? Math.max(0, Math.min(numericValue, priceRange[1]))
      : 0;
    onPriceChange([safeValue, priceRange[1]]);
  };

  const updateMaxPrice = (value: string) => {
    const numericValue = Number(value);
    const safeValue = Number.isFinite(numericValue)
      ? Math.max(priceRange[0], Math.min(numericValue, sliderMax))
      : sliderMax;
    onPriceChange([priceRange[0], safeValue]);
  };

  if (isLoading) {
    return <ProductFiltersSkeleton />;
  }

  return (
    <aside className="h-fit w-[18vw]">
      <div className="flex items-center justify-between border-b border-[#d4d4d4] pb-3 text-[14px] text-[#2f2f2f]">
        <button
          type="button"
          className="transition hover:text-black"
          onClick={onClearAll}
        >
          Clear All
        </button>
        <p>{itemCount} Items</p>
      </div>

      <FilterSectionBlock
        title="Category"
        value={activeCategory?.name ?? "All"}
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              selectedCategoryId === null
                ? "border-black bg-black text-white"
                : "border-[#bcbcbc] text-[#444]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`rounded-full border px-3 py-1 text-[12px] transition ${
                selectedCategoryId === category.id
                  ? "border-black bg-black text-white"
                  : "border-[#bcbcbc] text-[#444]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </FilterSectionBlock>

      <FilterSectionBlock
        title="Designers"
        value="All"
        expanded={expandedSections.designers}
        onToggle={() => toggleSection("designers")}
      />

      <FilterSectionBlock
        title="Size"
        value="All"
        expanded={expandedSections.size}
        onToggle={() => toggleSection("size")}
      />

      <FilterSectionBlock
        title="Occasion"
        value="All"
        expanded={expandedSections.occasion}
        onToggle={() => toggleSection("occasion")}
      />

      <FilterSectionBlock
        title="Fit"
        value="All"
        expanded={expandedSections.fit}
        onToggle={() => toggleSection("fit")}
      />

      <FilterSectionBlock
        title="Returns"
        value="All"
        expanded={expandedSections.returns}
        onToggle={() => toggleSection("returns")}
      >
        <div className="mt-3 space-y-2 text-[12px] text-[#2c2c2c]">
          {["Amendments", "Exchanges", "Returns"].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-[#8f8f8f] accent-black"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </FilterSectionBlock>

      <FilterSectionBlock
        title="Color"
        value="All"
        expanded={expandedSections.color}
        onToggle={() => toggleSection("color")}
      />

      <FilterSectionBlock
        title="Price"
        value={null}
        expanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="mt-4 space-y-3">
          <Slider
            range
            min={0}
            max={sliderMax}
            value={priceRange}
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                onPriceChange([value[0], value[1]]);
              }
            }}
            tooltip={{ open: false }}
          />

          <div className="grid grid-cols-2 gap-3 text-[13px] text-[#242424]">
            <label className="space-y-1">
              <span className="block text-[12px] text-[#5a5a5a]">min</span>
              <input
                type="number"
                min={0}
                max={priceRange[1]}
                className="w-full rounded-[10px] border border-[#8f8f8f] bg-transparent px-3 py-2 text-[12px]"
                value={priceRange[0]}
                onChange={(event) => updateMinPrice(event.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="block text-[12px] text-[#5a5a5a]">max</span>
              <input
                type="number"
                min={priceRange[0]}
                max={sliderMax}
                className="w-full rounded-[10px] border border-[#8f8f8f] bg-transparent px-3 py-2 text-[12px]"
                value={priceRange[1]}
                onChange={(event) => updateMaxPrice(event.target.value)}
              />
            </label>
          </div>
        </div>
      </FilterSectionBlock>
    </aside>
  );
}

interface FilterSectionBlockProps {
  title: string;
  value: string | null;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function FilterSectionBlock({
  title,
  value,
  expanded,
  onToggle,
  children,
}: FilterSectionBlockProps) {
  return (
    <section className="border-b border-[#d4d4d4] py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-[#222]"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="text-[20px] leading-none">{expanded ? "−" : "+"}</span>
      </button>

      {value ? <p className="mt-1 text-[12px] tracking-widest text-[#8a8a8a]">{value}</p> : null}

      {expanded ? children : null}
    </section>
  );
}
