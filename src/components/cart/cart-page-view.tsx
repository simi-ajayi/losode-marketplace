"use client";

import Link from "next/link";
import Image from "next/image";

import { Button, Empty, InputNumber, Typography } from "antd";

import { formatCurrency } from "@/lib/format";
import {
  removeFromCart,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const { Title, Paragraph } = Typography;

export function CartPageView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#eadfce] bg-white p-10 shadow-sm">
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
        <div className="flex justify-center">
          <Link href="/">
            <Button type="primary" className="!h-11 !rounded-full !px-8">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#eadfce] bg-white p-5 shadow-sm sm:p-7">
        <Title level={2} className="!mb-1 !font-serif !text-4xl !text-[#171717]">
          Your cart
        </Title>
        <Paragraph className="!m-0 !text-[#5d544a]">
          {itemCount} item{itemCount > 1 ? "s" : ""} ready for checkout.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4 rounded-3xl border border-[#eadfce] bg-white p-4 shadow-sm sm:p-6">
          {items.map((item) => (
            <article
              key={item.productId}
              className="flex flex-col gap-4 rounded-2xl border border-[#f1e9de] p-4 sm:flex-row sm:items-center"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={96}
                height={96}
                className="h-24 w-24 rounded-xl object-cover"
                unoptimized
              />

              <div className="flex-1">
                <h3 className="line-clamp-2 font-serif text-2xl text-[#171717]">{item.title}</h3>
                <p className="mt-1 text-lg font-semibold text-[#121212]">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(value) =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: Number(value ?? 1),
                      }),
                    )
                  }
                />

                <Button
                  danger
                  type="text"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                >
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-3xl text-[#191919]">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-[#62594d]">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#191919]">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button type="primary" className="!mt-8 !h-11 !w-full !rounded-full !font-medium">
              Proceed to checkout
            </Button>
          </Link>
        </aside>
      </div>
    </section>
  );
}
