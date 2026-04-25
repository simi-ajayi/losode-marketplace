import type { Product } from "@/types/product";

import { ProductCard } from "@/components/products/product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="grid grid-cols-2 2xl:gap-x-20 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
