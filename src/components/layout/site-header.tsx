"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  HeartOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, type MenuProps } from "antd";

import { selectCartItemCount } from "@/store/cart-slice";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

const TOP_TABS = [
  { label: "Women", href: "/" },
  { label: "Men", href: "/" },
  { label: "Kids", href: "/" },
];

const CATEGORY_LINKS = [
  { label: "Sale", href: "/", isSale: true },
  { label: "New In", href: "/" },
  { label: "Shop By", href: "/" },
  { label: "Clothing", href: "/" },
  { label: "Shoes", href: "/" },
  { label: "Grooming", href: "/" },
  { label: "Accessories", href: "/" },
  { label: "Home", href: "/" },
  { label: "Designers", href: "/" },
  { label: "Sell On Losode", href: "/" },
];

export function SiteHeader() {
  const cartCount = useAppSelector(selectCartItemCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const drawerItems = useMemo<MenuProps["items"]>(
    () => [
      ...TOP_TABS.map((item) => ({
        key: item.label,
        label: <Link href={item.href}>{item.label}</Link>,
      })),
      ...CATEGORY_LINKS.map((item) => ({
        key: `category-${item.label}`,
        label: (
          <Link href={item.href} className={item.isSale ? "text-[#e74242]" : undefined}>
            {item.label}
          </Link>
        ),
      })),
    ],
    [],
  );

  const imageUrl = "https://www.losode.com/images/logo-white-no-tag.png";

  return (
    <Layout.Header className="!top-0 !z-50 !h-auto !bg-transparent !p-0 !leading-normal">
      <div className="border-b border-[#d9d9d9] bg-[#ededed]">
        <div className="mx-auto flex h-7 w-full max-w-[2048px] items-center justify-between px-4 text-[13px] text-[#1f1f1f] sm:px-8 lg:px-20">
          <p className="truncate">
            New to Losode?{" "}
            <Link href="/" className="underline decoration-[1.5px] underline-offset-2">
              Subscribe
            </Link>{" "}
            and Get 10% off your first order
          </p>
          <Link href="/" className="hidden underline decoration-[1.5px] underline-offset-2 sm:inline">
            Sell On Losode
          </Link>
        </div>
      </div>

      <div className="bg-[#000000] py-2 text-white">
        <div className="mx-auto w-full max-w-[2048px] px-4 sm:px-8 lg:px-20">
          <div className="hidden lg:grid lg:h-[38px] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <nav className="flex items-center gap-8 text-[14px] leading-none">
              {TOP_TABS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    item.label === "Men"
                      ? "font-semibold text-white"
                      : "text-white/88 transition hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/"
              aria-label="Losode home"
              className="w-[140px] my-2 h-[50px]"
            >
                 <Image
                    src={imageUrl}
                    alt='Logo'
                    width={900}
                    height={1100}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
            </Link>

            <div className="ml-auto flex items-center gap-2 text-white">
              <Button
                type="text"
                className="!h-9 !rounded-none !border-0 !px-1 !text-[14px] !text-white hover:!bg-transparent hover:!text-white"
                icon={<SearchOutlined className="!text-[20px]" />}
              >
                Search
              </Button>
              <Button
                type="text"
                aria-label="Account"
                className="!h-9 !w-9 !rounded-none !border-0 !text-white hover:!bg-transparent hover:!text-white"
                icon={<UserOutlined className="!text-[21px]" />}
              />
              <Button
                type="text"
                aria-label="Wishlist"
                className="!h-9 !w-9 !rounded-none !border-0 !text-white hover:!bg-transparent hover:!text-white"
                icon={<HeartOutlined className="!text-[20px]" />}
              />
              <Link href="/cart" aria-label="Cart">
                <span className="losode-cart-badge-wrapper">
                  <Button
                    type="text"
                    className="!h-9 !w-9 !rounded-none !border-0 !text-white hover:!bg-transparent hover:!text-white"
                    icon={<ShoppingOutlined className="!text-[20px]" />}
                  />
                  <span className="losode-cart-badge-value">{cartCount}</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden mt-4 h-[52px] items-center gap-10 lg:flex">
            <div className="flex min-w-[114px] items-center gap-3 text-[14px]">
              <NigeriaFlagIcon />
              <span>NGN</span>
            </div>

            <nav className="flex flex-1 items-center justify-between mx-40 gap-5 text-[14px] leading-none">
              {CATEGORY_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={item.isSale ? "text-[#f54141]" : "text-white/92 hover:text-white"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex h-[74px] items-center justify-between lg:hidden">
            <Button
              type="text"
              icon={<MenuOutlined className="!text-[22px]" />}
              aria-label="Open menu"
              className="!h-10 !w-10 !rounded-none !text-white hover:!bg-transparent hover:!text-white"
              onClick={() => setIsMenuOpen(true)}
            />

            <Link
              href="/"
              aria-label="Losode home"
              className="font-serif text-[40px] leading-[0.82] tracking-[-0.03em] text-white"
            >
              losode
            </Link>

            <Link href="/cart" aria-label="Cart">
              <span className="losode-cart-badge-wrapper">
                <Button
                  type="text"
                  className="!h-10 !w-10 !rounded-none !border-0 !text-white hover:!bg-transparent hover:!text-white"
                  icon={<ShoppingOutlined className="!text-[21px]" />}
                />
                <span className="losode-cart-badge-value">{cartCount}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Drawer
        title={<span className="font-medium tracking-[0.06em]">Menu</span>}
        open={isMenuOpen}
        placement="left"
        width={340}
        onClose={() => setIsMenuOpen(false)}
      >
        <div className="mb-5 flex items-center gap-3 border-b border-[#e5e5e5] pb-4 text-[16px]">
          <NigeriaFlagIcon />
          <span>NGN</span>
        </div>
        <Menu
          mode="inline"
          className="!border-none"
          items={drawerItems}
          onClick={() => setIsMenuOpen(false)}
        />
      </Drawer>
    </Layout.Header>
  );
}

function NigeriaFlagIcon() {
  return (
    <span className="relative block h-7 w-7 overflow-hidden rounded-full border border-[#dbdbdb]">
      <span className="absolute inset-y-0 left-0 w-1/3 bg-[#0d8d5c]" />
      <span className="absolute inset-y-0 left-1/3 w-1/3 bg-[#ffffff]" />
      <span className="absolute inset-y-0 right-0 w-1/3 bg-[#0d8d5c]" />
    </span>
  );
}
