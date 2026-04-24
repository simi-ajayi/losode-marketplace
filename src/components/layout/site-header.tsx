"use client";

import Link from "next/link";

import { Badge, Button } from "antd";
import { selectCartItemCount } from "@/store/cart-slice";
import { useAppSelector } from "@/store/hooks";

export function SiteHeader() {
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d4d4d4] bg-[#ededed]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1880px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#6a6a6a]">
            LOSODE
          </span>
          <span className="text-[14px] text-[#414141]">Marketplace</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#515151] md:flex">
          <Link href="/" className="transition hover:text-[#111]">
            Shop
          </Link>
          <Link href="/checkout" className="transition hover:text-[#111]">
            Checkout
          </Link>
        </nav>

        <Link href="/cart">
          <Badge count={cartCount} size="small" color="#111111">
            <Button type="default" className="h-10 rounded-full px-5 font-medium">
              Cart
            </Button>
          </Badge>
        </Link>
      </div>
    </header>
  );
}
