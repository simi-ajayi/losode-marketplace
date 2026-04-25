"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { DownOutlined } from "@ant-design/icons";
import { Empty } from "antd";

import { AppButton } from "@/components/ui/app-button";
import { AppSelect } from "@/components/ui/app-select";
import { getCartItemMeta } from "@/lib/cart-item-meta";
import { formatCurrency } from "@/lib/format";
import {
  removeFromCart,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const PAYMENT_ICONS = [
  {
    src: "https://www.losode.com/icons/stripe-4.svg",
    alt: "Stripe",
    width: 40,
    height: 22,
  },
  {
    src: "https://www.losode.com/icons/paystack.png",
    alt: "Paystack",
    width: 96,
    height: 24,
  },
  {
    src: "https://www.losode.com/icons/paypal.svg",
    alt: "PayPal",
    width: 88,
    height: 26,
  },
  {
    src: "https://www.losode.com/icons/losodepay.svg",
    alt: "LosodePay",
    width: 108,
    height: 24,
  },
];

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, index) => ({
  label: String(index + 1),
  value: index + 1,
}));

export function CartPageView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  if (items.length === 0) {
    return (
      <div className="rounded-[14px] border border-[#cfcfcf] bg-[#f5f5f5] p-10 shadow-sm">
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
        <div className="flex justify-center">
          <Link href="/">
            <AppButton variant="primary" className="!h-11 !px-8 !text-[16px]">
              Continue shopping
            </AppButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(60%,1fr)_minmax(35%,1fr)]">
        <div>
          <div className="text-[20px] font-mono font-semibold uppercase leading-none tracking-[0.03em] sm:text-[28px]">
            Shopping Bag
          </div>
          <p className="mt-4 bg-[#f3e8e8] px-5 py-3 text-[15px] leading-[1.4] text-[#3d3530] sm:px-8">
            New to Losode? Use code <span className="underline">NEW10</span> for
            10% off your first order
          </p>

          <div className="mt-14 space-y-6">
            {items.map((item) => {
              const meta = getCartItemMeta(item);
              const isExpanded = !collapsedItems.has(item.productId);

              return (
                <article
                  key={item.productId}
                  className="overflow-hidden rounded-xl border !border-[#bdbdbd]"
                >
                  <header className="border-b !border-[#c9c9c9] px-6 py-4">
                    <AppButton
                      variant="text"
                      onClick={() =>
                        setCollapsedItems((previous) => {
                          const next = new Set(previous);

                          if (next.has(item.productId)) {
                            next.delete(item.productId);
                          } else {
                            next.add(item.productId);
                          }

                          return next;
                        })
                      }
                      className="!h-auto !w-full !justify-start !gap-3 !p-0"
                      aria-expanded={isExpanded}
                      aria-controls={`cart-item-${item.productId}`}
                    >
                      <DownOutlined
                        className={`text-[14px] leading-none transition-transform ${
                          isExpanded ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                      <div className="text-[15px] font-mono font-light uppercase leading-none">
                        {meta.vendor}{" "}
                        <span className="font-normal text-[15px] lowercase text-[#6b6b6b]">
                          ({item.quantity} item)
                        </span>
                      </div>
                    </AppButton>
                  </header>

                  {isExpanded ? (
                    <div
                      id={`cart-item-${item.productId}`}
                      className="grid p-5 sm:grid-cols-[126px_minmax(0,1fr)] sm:p-6"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={126}
                        height={190}
                        className="h-[150px] w-[102px] object-cover"
                        unoptimized
                      />

                      <div className="min-w-0">
                        <p className="text-[15px] leading-[1] text-[#202124]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[15px] text-[#232323]">
                          {meta.color}{" "}
                          <span className="px-2 text-[#a8a8a8]">|</span>
                          {meta.size}
                        </p>

                        <label className="mt-1 inline-flex items-center gap-3 text-[15px] text-[#252525]">
                          <span>Quantity:</span>
                          <AppSelect
                            uiSize="sm"
                            value={item.quantity}
                            onChange={(value) =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: Number(value),
                                }),
                              )
                            }
                            options={QUANTITY_OPTIONS}
                            className="!min-w-[72px]"
                          />
                        </label>

                        <p className="mt-2 text-[14px] font-semibold leading-none text-[#111111]">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="mt-2 flex items-center -ml-4 gap-4 text-[15px] text-[#474747]">
                          <AppButton
                            variant="text"
                            className="!h-auto !p-0 !text-[15px]"
                            onClick={() => {
                   
                            }}
                          >
                            Save for later
                          </AppButton>
                          <span className="text-[#bfbfbf]">|</span>
                          <AppButton
                            variant="text"
                            className="!h-auto !p-0 !text-[15px]"
                            onClick={() =>
                              dispatch(removeFromCart(item.productId))
                            }
                          >
                            Delete
                          </AppButton>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <aside className="h-fit md:px-10 px-2 pt-4">
          <h2 className="pb-6 text-[20px] font-semibold leading-none text-[#222326] sm:text-[22px]">
            Order Information
          </h2>

          <div className="space-y-4 border-y border-[#afafaf] py-5 text-[15px] text-[#393b3d]">
            <div className="flex items-center justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span className="tracking-widest">--</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[15px] text-[#393b3d]">
            <span>Total</span>
            <span className="tracking-widest">--</span>
          </div>

          <Link href="/checkout" className="mt-8 block">
            <AppButton
              fullWidth
              variant="primary"
              className="!h-12 !rounded-none !px-6 !text-[15px]"
            >
              Proceed To Checkout
            </AppButton>
          </Link>

          <p className="mt-4 text-[15px] leading-[1.4] text-[#3d3d3d]">
            Your Total Order price will be shown in &apos;Checkout&apos; once
            delivery has been selected
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {PAYMENT_ICONS.map((icon) => (
              <Image
                key={icon.src}
                src={icon.src}
                alt={icon.alt}
                width={icon.width}
                height={icon.height}
                className="h-18 w-20 object-contain"
                unoptimized
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
