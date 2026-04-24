"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Alert, Button, Form, Input, message } from "antd";

import { formatCurrency } from "@/lib/format";
import { clearCart, selectCartItemCount, selectCartItems, selectCartTotal } from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface CheckoutFormValues {
  name: string;
  email: string;
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "NGN";

export function CheckoutPageView() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const amountInLowestDenomination = useMemo(() => Math.round(total * 100), [total]);

  const initializePayment = async (values: CheckoutFormValues) => {
    setPaymentError(null);

    if (!PAYSTACK_KEY) {
      setPaymentError(
        "Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY. Add it to your environment file before testing payments.",
      );
      return;
    }

    if (amountInLowestDenomination <= 0) {
      setPaymentError("Cart total must be greater than zero before checkout.");
      return;
    }

    const [firstName, ...rest] = values.name.trim().split(" ");
    const lastName = rest.join(" ");
    const reference = `LS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      setIsPaying(true);

      const PaystackModule = await import("@paystack/inline-js");
      const Paystack = PaystackModule.default;
      const paystack = new Paystack();

      paystack.newTransaction({
        key: PAYSTACK_KEY,
        email: values.email,
        amount: amountInLowestDenomination,
        currency: PAYSTACK_CURRENCY,
        firstName,
        lastName,
        reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer name",
              variable_name: "customer_name",
              value: values.name,
            },
          ],
        },
        onSuccess: ({ reference: transactionReference }) => {
          dispatch(clearCart());
          message.success("Payment successful.");
          router.push(
            `/checkout/confirmation?status=success&reference=${transactionReference || reference}`,
          );
        },
        onCancel: () => {
          router.push(`/checkout/confirmation?status=cancelled&reference=${reference}`);
        },
        onError: ({ message: errorMessage }) => {
          const fallback = "Payment failed. Please try again.";
          setPaymentError(errorMessage || fallback);
          router.push(
            `/checkout/confirmation?status=failed&reference=${reference}&error=${encodeURIComponent(errorMessage || fallback)}`,
          );
        },
      });
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Unable to initialize payment at the moment.";
      setPaymentError(fallbackMessage);
    } finally {
      setIsPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-[#eadfce] bg-white p-10 text-center shadow-sm">
        <h1 className="font-serif text-4xl text-[#1a1a1a]">Checkout</h1>
        <p className="mx-auto mt-3 max-w-lg text-[#5f554b]">
          Your cart is empty. Add products first to proceed with checkout.
        </p>
        <Link href="/">
          <Button type="primary" className="!mt-7 !h-11 !rounded-full !px-8">
            Browse products
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.8fr]">
      <div className="rounded-3xl border border-[#eadfce] bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a6e60]">
          Secure checkout
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#161616]">Shipping details</h1>

        {paymentError ? (
          <Alert
            className="!mt-5"
            type="error"
            showIcon
            message="Payment initialization failed"
            description={paymentError}
          />
        ) : null}

        <Form<CheckoutFormValues>
          layout="vertical"
          className="mt-6"
          onFinish={initializePayment}
          requiredMark={false}
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input size="large" placeholder="Ada Lovelace" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Provide a valid email address" },
            ]}
          >
            <Input size="large" placeholder="ada@example.com" />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={isPaying}
            className="!mt-3 !h-12 !w-full !rounded-full !text-sm !font-semibold"
          >
            Pay with Paystack
          </Button>
        </Form>
      </div>

      <aside className="h-fit rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Order summary</h2>
        <p className="mt-1 text-sm text-[#645a50]">{itemCount} item(s) in your order</p>

        <div className="mt-5 space-y-3 border-y border-[#eee3d3] py-5">
          {items.map((item) => (
            <div key={item.productId} className="flex items-start justify-between gap-4 text-sm">
              <p className="line-clamp-2 text-[#433a33]">
                {item.title} <span className="text-[#786e66]">x{item.quantity}</span>
              </p>
              <p className="font-medium text-[#1a1a1a]">
                {formatCurrency(item.price * item.quantity, PAYSTACK_CURRENCY)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-base font-semibold text-[#1a1a1a]">
          <span>Total</span>
          <span>{formatCurrency(total, PAYSTACK_CURRENCY)}</span>
        </div>
      </aside>
    </section>
  );
}
