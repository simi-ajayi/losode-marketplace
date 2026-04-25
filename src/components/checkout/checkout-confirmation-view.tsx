"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Result } from "antd";
import { AppButton } from "@/components/ui/app-button";

export function CheckoutConfirmationView() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const reference = searchParams.get("reference");
  const error = searchParams.get("error");

  if (status === "success") {
    return (
      <section className="rounded-3xl  border border-[#eadfce] bg-white px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
        <Result
          status="success"
          title="Payment successful"
          subTitle={`Reference: ${reference ?? "N/A"}`}
          extra={
            <Link href="/">
              <AppButton variant="primary" className="!h-11 !rounded-full !px-8">
                Continue shopping
              </AppButton>
            </Link>
          }
        />
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="rounded-3xl border border-[#eadfce] bg-white px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
        <Result
          status="error"
          title="Payment failed"
          subTitle={error ?? "An error occurred while processing payment."}
          extra={
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/checkout">
                <AppButton
                  variant="primary"
                  className="!h-11 !rounded-full !px-8"
                >
                  Retry payment
                </AppButton>
              </Link>
              <Link href="/cart">
                <AppButton
                  variant="outline"
                  className="!h-11 !rounded-full !px-8"
                >
                  Back to cart
                </AppButton>
              </Link>
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#eadfce] bg-white px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
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
              <AppButton
                variant="primary"
                className="!h-11 !rounded-full !px-8"
              >
                Return to checkout
              </AppButton>
            </Link>
            <Link href="/">
              <AppButton
                variant="outline"
                className="!h-11 !rounded-full !px-8"
              >
                Continue shopping
              </AppButton>
            </Link>
          </div>
        }
      />
    </section>
  );
}
