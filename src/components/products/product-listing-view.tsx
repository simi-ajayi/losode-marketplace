"use client";

import { FilterOutlined } from "@ant-design/icons";
import { Alert, AutoComplete, Button, Drawer, Input, Pagination } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { AppSelect } from "@/components/ui/app-select";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductListingSkeleton } from "@/components/products/product-loading-state";
import { useCategories } from "@/lib/hooks/use-categories";
import { useProducts } from "@/lib/hooks/use-products";
import {
  getClosestProductTitleSuggestions,
  HEADER_SEARCH_PARAM,
  normalizeProductSearchTerm,
  PRODUCT_LISTING_SEARCH_PARAM,
} from "@/lib/product-search";

type SortMode = "sort" | "price-low-to-high" | "price-high-to-low";
const DEFAULT_MAX_PRICE = 600000;
const PRODUCTS_PAGE_SIZE = 16;

export function ProductListingView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("sort");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, DEFAULT_MAX_PRICE]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: products = [], isLoading, isError, error } = useProducts();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const listingSearchTerm = searchParams.get(PRODUCT_LISTING_SEARCH_PARAM) ?? "";
  const headerSearchTerm = searchParams.get(HEADER_SEARCH_PARAM) ?? "";

  const updateSearchTerm = useCallback(
    (nextSearchTerm: string) => {
      const normalizedValue = nextSearchTerm.trim();
      const currentQueryValue = searchParams.get(PRODUCT_LISTING_SEARCH_PARAM) ?? "";

      if (normalizedValue === currentQueryValue) {
        return;
      }

      const nextSearchParams = new URLSearchParams(searchParams.toString());
      if (normalizedValue) {
        nextSearchParams.set(PRODUCT_LISTING_SEARCH_PARAM, normalizedValue);
      } else {
        nextSearchParams.delete(PRODUCT_LISTING_SEARCH_PARAM);
      }

      const nextUrl = nextSearchParams.toString()
        ? `${pathname}?${nextSearchParams.toString()}`
        : pathname;

      setCurrentPage(1);
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const normalizedSearchTerm = useMemo(
    () => normalizeProductSearchTerm(listingSearchTerm),
    [listingSearchTerm],
  );

  const normalizedHeaderSearchTerm = useMemo(
    () => normalizeProductSearchTerm(headerSearchTerm),
    [headerSearchTerm],
  );

  const effectiveSearchTerm = normalizedSearchTerm || normalizedHeaderSearchTerm;

  const productTitles = useMemo(
    () => products.map((product) => product.title),
    [products],
  );

  const maxPrice = useMemo(
    () => products.reduce((acc, product) => Math.max(acc, product.price), 0),
    [products],
  );

  const sliderMax = Math.max(maxPrice, DEFAULT_MAX_PRICE);

  const categoryAndPriceFilteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategoryId
        ? product.category.id === selectedCategoryId
        : true;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesPrice;
    });
  }, [priceRange, products, selectedCategoryId]);

  const searchSuggestions = useMemo(() => {
    return getClosestProductTitleSuggestions(productTitles, normalizedSearchTerm, 5).map(
      (title) => ({
        value: title,
        label: title,
      }),
    );
  }, [normalizedSearchTerm, productTitles]);

  const filteredProducts = useMemo(() => {
    if (!effectiveSearchTerm) {
      return categoryAndPriceFilteredProducts;
    }

    return categoryAndPriceFilteredProducts.filter((product) =>
      normalizeProductSearchTerm(product.title).includes(effectiveSearchTerm),
    );
  }, [categoryAndPriceFilteredProducts, effectiveSearchTerm]);

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

  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / PRODUCTS_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PAGE_SIZE;
    return displayedProducts.slice(startIndex, startIndex + PRODUCTS_PAGE_SIZE);
  }, [displayedProducts, safeCurrentPage]);

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
    <div className="space-y-10 px-4 py-6 sm:px-7 sm:py-8 xl:p1x-15 2xl:px-20 lg:py-9">
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

      <div className="flex w-full  flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="hidden lg:block">
          <ProductFilters
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={(nextCategoryId) => {
              setSelectedCategoryId(nextCategoryId);
              setCurrentPage(1);
            }}
            maxPrice={sliderMax}
            priceRange={priceRange}
            onPriceChange={(nextPriceRange) => {
              setPriceRange(nextPriceRange);
              setCurrentPage(1);
            }}
            categories={categories}
            itemCount={displayedProducts.length}
            isLoading={isCategoriesLoading}
            onClearAll={() => {
              setSelectedCategoryId(null);
              setPriceRange([0, sliderMax]);
              setSortMode("sort");
              setCurrentPage(1);
            }}
          />
        </div>

        <section className="flex-1 space-y-6">
          <div className="lg:hidden">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsMobileFiltersOpen(true)}
              className="!h-10 !rounded-none !border-[#333] !px-4 !text-[14px] !text-[#222]"
            >
              Filters
            </Button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <AutoComplete
              value={listingSearchTerm}
              options={searchSuggestions}
              filterOption={false}
              onChange={(value) => updateSearchTerm(value)}
              onSelect={(value) => updateSearchTerm(value)}
              className="w-full lg:max-w-[430px]"
              popupClassName="!rounded-none"
            >
              <Input
                allowClear
                size="large"
                placeholder="Search products by name or title"
                className="!rounded-none !border-[#9f9f9f]"
              />
            </AutoComplete>

            <label className="inline-flex items-center gap-2 text-[16px] text-[#2a2a2a] lg:justify-end">
              <AppSelect
                className="!w-[220px]"
                value={sortMode}
                onChange={(value) => {
                  setSortMode(value as SortMode);
                  setCurrentPage(1);
                }}
                options={[
                  // { label: "Featured", value: "featured" },
                  { label: "Price: Low to High", value: "price-low-to-high" },
                  { label: "Price: High to Low", value: "price-high-to-low" },
                ]}
              />
            </label>
          </div>

          {displayedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />
              <div className="flex justify-center">
                <Pagination
                  current={safeCurrentPage}
                  pageSize={PRODUCTS_PAGE_SIZE}
                  total={displayedProducts.length}
                  showSizeChanger={false}
                  onChange={(page) => setCurrentPage(page)}
                  className="!mt-3"
                />
              </div>
            </>
          ) : (
            <EmptyState description="No products match the current filter selection." />
          )}
        </section>
      </div>

      <Drawer
        title={<span className="text-[14px] tracking-[0.08em]">Filters</span>}
        placement="left"
        width="84%"
        open={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        className="lg:!hidden"
      >
        <ProductFilters
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={(nextCategoryId) => {
            setSelectedCategoryId(nextCategoryId);
            setCurrentPage(1);
          }}
          maxPrice={sliderMax}
          priceRange={priceRange}
          onPriceChange={(nextPriceRange) => {
            setPriceRange(nextPriceRange);
            setCurrentPage(1);
          }}
          categories={categories}
          itemCount={displayedProducts.length}
          isLoading={isCategoriesLoading}
          onClearAll={() => {
            setSelectedCategoryId(null);
            setPriceRange([0, sliderMax]);
            setSortMode("sort");
            setCurrentPage(1);
          }}
        />
      </Drawer>
    </div>
  );
}
