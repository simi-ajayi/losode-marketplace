"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { message } from "antd";

import { AppButton } from "@/components/ui/app-button";
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
      <div className="relative overflow-hidden 2xl:w-[18vw] xl:w-[16vw] bg-[#d6d6d6]">
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={imageUrl}
            alt={product.title}
            width={900}
            height={1100}
            className="aspect-[4/5] h-full min-h-[400px] md:min-h-[480px] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            unoptimized
          />
        </Link>

        <AppButton
          htmlType="button"
          aria-label={isSaved ? "Remove from saved items" : "Save item"}
          variant="ghost"
          uiSize="icon"
          className="!absolute !right-3 !top-3 !rounded-full !border !border-black/10 !bg-white !text-[#7f1616] !shadow-[0_4px_10px_rgba(0,0,0,0.14)] hover:!scale-105"
          onClick={() => {
            setIsSaved((previous) => {
              const next = !previous;
              message.info(next ? "Item saved." : "Item removed from saved items.");
              return next;
            });
          }}
        >
          {isSaved ? (
            <HeartFilled className="text-[21px] transition" />
          ) : (
            <HeartOutlined className="text-[21px] transition" />
          )}
        </AppButton>
      </div>

      <div className="">
        <p className="text-[17px] font-semibold uppercase leading-none tracking-[0.02em] text-[#222226]">
          {designerLabel}
        </p>

        <Link href={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 text-[15px] text-[#2d2d2d]">
            {product.title}
          </h3>
        </Link>

        <p className="text-[13px] mt-2 font-semibold text-[#0f0f0f]">
          {formatCurrency(product.price, "NGN")}
        </p>
      </div>
    </article>
  );
}
