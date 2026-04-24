"use client";

import Link from "next/link";

import { Badge, Button } from "antd";
import { selectCartItemCount } from "@/store/cart-slice";
import { useAppSelector } from "@/store/hooks";

export function SiteHeader() {
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece3d7] bg-[rgba(252,248,243,0.96)] backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.26em] text-[#8b785f]">
            Losode
          </span>
          <span className="font-serif text-2xl text-[#161616]">Marketplace</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#5f5750] md:flex">
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
