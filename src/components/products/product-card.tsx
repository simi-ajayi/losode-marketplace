"use client";

import Link from "next/link";
import Image from "next/image";

import { Button, Tag, message } from "antd";

import { formatCurrency } from "@/lib/format";
import { addToCart } from "@/store/cart-slice";
import { useAppDispatch } from "@/store/hooks";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const imageUrl = product.images[0] || FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#efe6da] bg-white shadow-[0_24px_45px_-36px_rgba(17,17,17,0.45)] transition duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block overflow-hidden bg-[#f7f2ea]">
        <Image
          src={imageUrl}
          alt={product.title}
          width={900}
          height={1100}
          className="aspect-[4/5] h-full w-full object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2">
          <Tag bordered={false} className="m-0 rounded-full bg-[#f5ede1] px-3 py-1 text-xs text-[#6a5f51]">
            {product.category.name}
          </Tag>
          <h3 className="line-clamp-2 min-h-[56px] font-serif text-xl leading-7 text-[#171717]">
            {product.title}
          </h3>
          <p className="text-lg font-semibold text-[#111111]">{formatCurrency(product.price)}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href={`/products/${product.id}`}>
            <Button type="default" className="h-11 w-full rounded-full font-medium">
              View details
            </Button>
          </Link>
          <Button
            type="primary"
            className="h-11 w-full rounded-full font-medium"
            onClick={() => {
              dispatch(addToCart(product));
              message.success("Item added to cart.");
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
