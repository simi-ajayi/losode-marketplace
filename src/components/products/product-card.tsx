"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { message } from "antd";

import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const imageUrl = product.images[0] || FALLBACK_IMAGE;
  const designerLabel = useMemo(() => {
    const words = product.title
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "LOSODE";
    }

    return words.slice(0, 2).join(" ").toUpperCase();
  }, [product.title]);

  return (
    <article className="group space-y-4">
      <div className="relative overflow-hidden w-[18vw] bg-[#d6d6d6]">
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={imageUrl}
            alt={product.title}
            width={900}
            height={1100}
            className="aspect-[4/5] min-h-[480px]  h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            unoptimized
          />
        </Link>

        <button
          type="button"
          aria-label={isSaved ? "Remove from saved items" : "Save item"}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#7f1616] shadow-[0_4px_10px_rgba(0,0,0,0.14)] transition hover:scale-105"
          onClick={() => {
            setIsSaved((previous) => {
              const next = !previous;
              message.info(next ? "Item saved." : "Item removed from saved items.");
              return next;
            });
          }}
        >
          <HeartIcon filled={isSaved} />
        </button>
      </div>

      <div className="">
        <p className="text-[17px] font-semibold uppercase leading-none tracking-[0.02em] text-[#222226]">
          {designerLabel}
        </p>

        <Link href={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 min-h-[58px] text-[15px] text-[2d2d2d]">
            {product.title}
          </h3>
        </Link>

        <p className="text-[13px] -mt-7 font-semibold text-[#0f0f0f]">
          {formatCurrency(product.price, "NGN")}
        </p>
      </div>
    </article>
  );
}

interface HeartIconProps {
  filled: boolean;
}

function HeartIcon({ filled }: HeartIconProps) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.7"
      className="transition"
      aria-hidden
    >
      <path
        d="M19.08 4.65A5.5 5.5 0 0 0 12 5.95a5.5 5.5 0 0 0-7.08-1.3A5.43 5.43 0 0 0 3.7 12.5L12 20.3l8.3-7.8a5.43 5.43 0 0 0-1.22-7.85Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
