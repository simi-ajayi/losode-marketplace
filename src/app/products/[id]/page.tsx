import { notFound } from "next/navigation";

import { ProductDetailsView } from "@/components/products/product-details-view";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  return <ProductDetailsView productId={productId} />;
}
