"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button, Result } from "antd";

export function CheckoutConfirmationView() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const reference = searchParams.get("reference");
  const error = searchParams.get("error");

  if (status === "success") {
    return (
      <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-10">
        <Result
          status="success"
          title="Payment successful"
          subTitle={`Reference: ${reference ?? "N/A"}`}
          extra={
            <Link href="/">
              <Button type="primary" className="!h-11 !rounded-full !px-8">
                Continue shopping
              </Button>
            </Link>
          }
        />
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-10">
        <Result
          status="error"
          title="Payment failed"
          subTitle={error ?? "An error occurred while processing payment."}
          extra={
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/checkout">
                <Button type="primary" className="!h-11 !rounded-full !px-8">
                  Retry payment
                </Button>
              </Link>
              <Link href="/cart">
                <Button className="!h-11 !rounded-full !px-8">Back to cart</Button>
              </Link>
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-10">
      <Result
        status="warning"
        title="Payment cancelled"
        subTitle={
          reference
            ? `You cancelled transaction ${reference}. You can resume checkout anytime.`
            : "You cancelled the payment flow."
        }
        extra={
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/checkout">
              <Button type="primary" className="!h-11 !rounded-full !px-8">
                Return to checkout
              </Button>
            </Link>
            <Link href="/">
              <Button className="!h-11 !rounded-full !px-8">Continue shopping</Button>
            </Link>
          </div>
        }
      />
    </section>
  );
}
