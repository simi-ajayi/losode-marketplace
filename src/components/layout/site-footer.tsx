export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#d4d4d4] bg-[#e9e9e9]">
      <div className="mx-auto flex w-full max-w-[1880px] flex-col gap-2 px-4 py-7 text-sm text-[#595959] sm:px-7 lg:px-10">
        <p className="font-medium text-[#1b1b1b]">Losode Marketplace</p>
        <p>
          Built with Next.js App Router, Redux Toolkit, TanStack Query, Tailwind CSS, and
          Ant Design.
        </p>
      </div>
    </footer>
  );
}
