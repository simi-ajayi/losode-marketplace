"use client";

import { Alert } from "antd";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductListingSkeleton } from "@/components/products/product-loading-state";
import { useCategories } from "@/lib/hooks/use-categories";
import { useProducts } from "@/lib/hooks/use-products";

type SortMode = "featured" | "price-low-to-high" | "price-high-to-low";
const DEFAULT_MAX_PRICE = 600000;

export function ProductListingView() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
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
    if (sortMode === "featured") {
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
    <div className="space-y-10">
      <section className="mx-auto max-w-7xl space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-[0.01em] text-[#171717] sm:text-5xl">
          Clothing
        </h1>
        <p className="mx-auto max-w-6xl text-base leading-8 text-[#343434] sm:text-lg">
          From tailored fits to relaxed styles, find pieces that seamlessly blend
          comfort with class, perfect for any occasion, because you deserve to look your
          best every day.
        </p>
      </section>

      <div className="flex gap-10 w-full">
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
            setSortMode("featured");
          }}
        />

        <section className="space-y-6">
          <div className="flex justify-end">
            <label className="inline-flex items-center gap-2 text-[16px] text-[#2a2a2a]">
              Sort
              <select
                className="rounded-md border border-[#c8c8c8] bg-transparent px-2 py-1 text-[15px] outline-none transition focus:border-[#111]"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
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
