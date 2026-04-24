interface ProductCardsSkeletonProps {
  count?: number;
}

export function ProductFiltersSkeleton() {
  return (
    <aside className="h-fit">
      <div className="flex items-center justify-between border-b border-[#d4d4d4] pb-3">
        <div className="h-5 w-20 animate-pulse rounded bg-[#d9d9d9]" />
        <div className="h-5 w-24 animate-pulse rounded bg-[#d9d9d9]" />
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`section-skeleton-${index}`} className="space-y-3 border-b border-[#d4d4d4] py-5">
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 animate-pulse rounded bg-[#d9d9d9]" />
            <div className="h-5 w-5 animate-pulse rounded bg-[#d9d9d9]" />
          </div>
          <div className="h-4 w-14 animate-pulse rounded bg-[#e3e3e3]" />
        </div>
      ))}

      <div className="space-y-4 border-b border-[#d4d4d4] py-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 animate-pulse rounded bg-[#d9d9d9]" />
          <div className="h-5 w-5 animate-pulse rounded bg-[#d9d9d9]" />
        </div>
        <div className="h-2 w-full animate-pulse rounded bg-[#d9d9d9]" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-9 animate-pulse rounded-md bg-[#e3e3e3]" />
          <div className="h-9 animate-pulse rounded-md bg-[#e3e3e3]" />
        </div>
      </div>
    </aside>
  );
}

export function ProductCardsSkeleton({ count = 8 }: ProductCardsSkeletonProps) {
  return (
    <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <article key={`card-skeleton-${index}`} className="space-y-4">
          <div className="relative overflow-hidden rounded-sm bg-[#dadada]">
            <div className="aspect-[4/5] animate-pulse bg-[#d0d0d0]" />
            <div className="absolute right-3 top-3 h-10 w-10 animate-pulse rounded-full bg-white/80" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-[#d9d9d9]" />
            <div className="h-5 w-full animate-pulse rounded bg-[#e0e0e0]" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#e0e0e0]" />
            <div className="h-6 w-28 animate-pulse rounded bg-[#d9d9d9]" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function ProductListingSkeleton() {
  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-5xl space-y-4 pt-4 text-center">
        <div className="mx-auto h-11 w-64 animate-pulse rounded bg-[#d9d9d9]" />
        <div className="mx-auto h-6 w-full max-w-4xl animate-pulse rounded bg-[#e0e0e0]" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
        <ProductFiltersSkeleton />
        <div className="space-y-6">
          <div className="ml-auto h-8 w-28 animate-pulse rounded bg-[#d9d9d9]" />
          <ProductCardsSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="space-y-7">
      <div className="h-6 w-full max-w-4xl animate-pulse rounded bg-[#dbdbdb]" />

      <section className="grid gap-10 xl:grid-cols-[minmax(0,980px)_minmax(380px,1fr)]">
        <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-6">
          <div className="hidden space-y-4 sm:block">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`detail-thumb-skeleton-${index}`}
                className="aspect-[4/5] w-[84px] animate-pulse rounded-sm bg-[#d4d4d4]"
              />
            ))}
          </div>
          <div className="aspect-[4/5] animate-pulse rounded-sm bg-[#d4d4d4]" />
        </div>

        <div className="space-y-5">
          <div className="h-10 w-80 animate-pulse rounded bg-[#d6d6d6]" />
          <div className="h-24 w-full animate-pulse rounded bg-[#dedede]" />
          <div className="h-10 w-40 animate-pulse rounded bg-[#d6d6d6]" />
          <div className="h-6 w-36 animate-pulse rounded bg-[#dfdfdf]" />
          <div className="h-12 w-full animate-pulse rounded bg-[#d4d4d4]" />
          <div className="h-12 w-full animate-pulse rounded bg-[#dcdcdc]" />
          <div className="h-44 w-full animate-pulse rounded bg-[#dfdfdf]" />
        </div>
      </section>
    </div>
  );
}
