"use client";

import { Alert, Skeleton, Typography } from "antd";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { useCategories } from "@/lib/hooks/use-categories";
import { useProducts } from "@/lib/hooks/use-products";

const { Title, Paragraph } = Typography;

export function ProductListingView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: products = [], isLoading, isError, error } = useProducts();
  const { data: categories = [] } = useCategories();

  const maxPrice = useMemo(
    () => products.reduce((acc, product) => Math.max(acc, product.price), 0),
    [products],
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1200]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory = selectedCategoryId
        ? product.category.id === selectedCategoryId
        : true;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [priceRange, products, searchTerm, selectedCategoryId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
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
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#e8decd] bg-[radial-gradient(circle_at_top_right,#f7efe2_0%,#fbf8f3_52%,#ffffff_100%)] p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#786d5f]">
          Discover style
        </p>
        <Title level={1} className="!mb-2 !mt-3 !font-serif !text-[40px] !leading-tight !text-[#181818] sm:!text-[56px]">
          Shop curated fashion pieces
        </Title>
        <Paragraph className="!m-0 max-w-2xl !text-base !text-[#5c544d]">
          Explore a modern storefront inspired by Losode&apos;s visual rhythm, featuring
          curated product cards, elevated spacing, and clear hierarchy.
        </Paragraph>
      </section>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        maxPrice={maxPrice}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        categories={categories}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyState description="No products match the current search/filter selection." />
      )}
    </div>
  );
}
