"use client";

import { Alert } from "antd";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { AppSelect } from "@/components/ui/app-select";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductListingSkeleton } from "@/components/products/product-loading-state";
import { useCategories } from "@/lib/hooks/use-categories";
import { useProducts } from "@/lib/hooks/use-products";

type SortMode = "sort" | "price-low-to-high" | "price-high-to-low";
const DEFAULT_MAX_PRICE = 600000;

export function ProductListingView() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("sort");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, DEFAULT_MAX_PRICE]);

  const { data: products = [], isLoading, isError, error } = useProducts();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const maxPrice = useMemo(
    () => products.reduce((acc, product) => Math.max(acc, product.price), 0),
    [products],
  );

  const sliderMax = Math.max(maxPrice, DEFAULT_MAX_PRICE);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategoryId
        ? product.category.id === selectedCategoryId
        : true;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesPrice;
    });
  }, [priceRange, products, selectedCategoryId]);

  const displayedProducts = useMemo(() => {
    if (sortMode === "sort") {
      return filteredProducts;
    }

    return [...filteredProducts].sort((a, b) => {
      if (sortMode === "price-low-to-high") {
        return a.price - b.price;
      }
      return b.price - a.price;
    });
  }, [filteredProducts, sortMode]);

  if (isLoading) {
    return <ProductListingSkeleton />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load products"
        description={error instanceof Error ? error.message : "Please try again."}
      />
    );
  }

  return (
    <div className="space-y-10 px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
      <section className="mx-auto max-w-7xl space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-[0.01em] text-[#171717] sm:text-5xl">
          Clothing
        </h1>
        <p className="mx-auto max-w-6xl text-base leading-8 text-[#343434] sm:text-lg">
          From tailored fits to relaxed styles, find pieces that seamlessly
          blend comfort with class, perfect for any occasion, because you
          deserve to look your best every day.
        </p>
      </section>

      <div className="flex w-full gap-10">
        <ProductFilters
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          maxPrice={sliderMax}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          categories={categories}
          itemCount={displayedProducts.length}
          isLoading={isCategoriesLoading}
          onClearAll={() => {
            setSelectedCategoryId(null);
            setPriceRange([0, sliderMax]);
            setSortMode("sort");
          }}
        />

        <section className="space-y-6">
          <div className="flex justify-end">
            <label className="inline-flex items-center gap-2 text-[16px] text-[#2a2a2a]">
              <AppSelect
                className="!w-[220px]"
                value={sortMode}
                onChange={(value) => setSortMode(value as SortMode)}
                options={[
                  // { label: "Featured", value: "featured" },
                  { label: "Price: Low to High", value: "price-low-to-high" },
                  { label: "Price: High to Low", value: "price-high-to-low" },
                ]}
              />
            </label>
          </div>

          {displayedProducts.length > 0 ? (
            <ProductGrid products={displayedProducts} />
          ) : (
            <EmptyState description="No products match the current filter selection." />
          )}
        </section>
      </div>
    </div>
  );
}
