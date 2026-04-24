"use client";

import Link from "next/link";
import Image from "next/image";

import { Alert, Button, Skeleton, Tag, Typography, message } from "antd";

import { formatCurrency } from "@/lib/format";
import { useProduct } from "@/lib/hooks/use-product";

const { Title, Paragraph } = Typography;

interface ProductDetailsViewProps {
  productId: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";

export function ProductDetailsView({ productId }: ProductDetailsViewProps) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  if (isError || !product) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load product"
        description={error instanceof Error ? error.message : "Please try again."}
      />
    );
  }

  const imageUrl = product.images[0] || FALLBACK_IMAGE;

  const handleAddToCart = () => {
    message.info("Cart actions are enabled in the next feature branch.");
  };

  return (
    <section className="grid grid-cols-1 gap-8 rounded-3xl border border-[#eadfce] bg-white p-4 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <div className="overflow-hidden rounded-3xl bg-[#f7f1e6]">
        <Image
          src={imageUrl}
          alt={product.title}
          width={1200}
          height={1200}
          className="aspect-square h-full w-full object-cover"
          unoptimized
        />
      </div>

      <div className="flex flex-col gap-5">
        <Tag bordered={false} className="w-fit rounded-full bg-[#f4ecdf] px-3 py-1 text-[#655949]">
          {product.category.name}
        </Tag>

        <Title level={1} className="!m-0 !font-serif !text-4xl !leading-tight !text-[#1a1a1a]">
          {product.title}
        </Title>

        <p className="text-3xl font-semibold text-[#111111]">{formatCurrency(product.price)}</p>

        <Paragraph className="!m-0 !text-base !leading-8 !text-[#5d534a]">
          {product.description}
        </Paragraph>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="primary" size="large" className="!h-11 !rounded-full !px-8" onClick={handleAddToCart}>
            Add to cart
          </Button>
          <Link href="/">
            <Button size="large" className="!h-11 !rounded-full !px-8">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
