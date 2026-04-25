"use client";

import { useMemo, useState } from "react";

import { Slider } from "antd";

import { ProductFiltersSkeleton } from "@/components/products/product-loading-state";
import { AppButton } from "@/components/ui/app-button";
import { AppCheckbox } from "@/components/ui/app-checkbox";
import { AppInputNumber } from "@/components/ui/app-input";
import { SectionToggleButton } from "@/components/ui/section-toggle-button";
import type { Category } from "@/types/product";

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

  const updateMinPrice = (value: number | null) => {
    const safeValue = Number.isFinite(value)
      ? Math.max(0, Math.min(value as number, priceRange[1]))
      : 0;
    onPriceChange([safeValue, priceRange[1]]);
  };

  const updateMaxPrice = (value: number | null) => {
    const safeValue = Number.isFinite(value)
      ? Math.max(priceRange[0], Math.min(value as number, sliderMax))
      : sliderMax;
    onPriceChange([priceRange[0], safeValue]);
  };

  if (isLoading) {
    return <ProductFiltersSkeleton />;
  }

  return (
    <aside className="h-fit xl:w-[25vw] 2xl:w-[18vw]">
      <div className="flex items-center justify-between border-b border-[#d4d4d4] pb-3 text-[14px] text-[#2f2f2f]">
        <AppButton
          variant="text"
          onClick={onClearAll}
          className="!h-auto !px-0 !text-[14px]"
        >
          Clear All
        </AppButton>
        <p>{itemCount} Items</p>
      </div>

      <FilterSectionBlock
        title="Category"
        value={activeCategory?.name ?? "All"}
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="mt-3 flex">
          <AppButton
            variant="chip"
            uiSize="sm"
            onClick={() => onCategoryChange(null)}
            className={
              selectedCategoryId === null
                ? "!border-black !bg-black !text-[#444]"
                : "!border-[#bcbcbc] !text-[#444]"
            }
          >
            All
          </AppButton>
          {categories.map((category) => (
            <AppButton
              key={category.id}
              variant="chip"
              uiSize="sm"
              onClick={() => onCategoryChange(category.id)}
              className={
                selectedCategoryId === category.id
                  ? "!border-black !bg-black !text-[#444]"
                  : "!border-[#bcbcbc] !text-[#444]"
              }
            >
              {category.name}
            </AppButton>
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
            <AppCheckbox key={option}>{option}</AppCheckbox>
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
              <AppInputNumber
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={updateMinPrice}
              />
            </label>

            <label className="space-y-1">
              <span className="block text-[12px] text-[#5a5a5a]">max</span>
              <AppInputNumber
                min={priceRange[0]}
                max={sliderMax}
                value={priceRange[1]}
                onChange={updateMaxPrice}
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
      <SectionToggleButton
        expanded={expanded}
        onClick={onToggle}
        label={title}
        className="!text-[13px] !tracking-wider"
        labelClassName="text-[#222222]"
      />

      {value ? <p className="mt-1 ml-4 text-[12px] tracking-widest text-[#8a8a8a]">{value}</p> : null}

      {expanded ? children : null}
    </section>
  );
}
