import Link from "next/link";

export default function CheckoutPage() {
  return (
    <section className="rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-sm">
      <h1 className="font-serif text-3xl text-[#1a1a1a]">Checkout & payment branch next</h1>
      <p className="mx-auto mt-3 max-w-xl text-base text-[#5d544a]">
        Paystack checkout flow is introduced in a dedicated feature branch.
      </p>
      <Link href="/">
        <span className="mt-6 inline-flex h-11 items-center rounded-full bg-[#111111] px-8 text-sm font-medium text-white">
          Back to products
        </span>
      </Link>
    </section>
  );
}
