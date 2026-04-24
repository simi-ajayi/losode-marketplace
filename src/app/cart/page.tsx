import Link from "next/link";

export default function CartPage() {
  return (
    <section className="rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-sm">
      <h1 className="font-serif text-3xl text-[#1a1a1a]">Cart module loading next</h1>
      <p className="mx-auto mt-3 max-w-xl text-base text-[#5d544a]">
        The Redux Toolkit cart state is implemented in the next feature branch.
      </p>
      <Link href="/">
        <span className="mt-6 inline-flex h-11 items-center rounded-full bg-[#111111] px-8 text-sm font-medium text-white">
          Continue shopping
        </span>
      </Link>
    </section>
  );
}
