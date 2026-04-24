export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#ece3d7] bg-[#faf5ed]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-4 py-10 text-sm text-[#6f665f] sm:px-6 lg:px-8">
        <p className="font-medium text-[#1b1b1b]">Losode Marketplace Concept Store</p>
        <p>
          Built with Next.js App Router, Redux Toolkit, TanStack Query, Tailwind CSS,
          and Ant Design.
        </p>
      </div>
    </footer>
  );
}
