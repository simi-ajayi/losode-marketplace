"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Alert, message } from "antd";

import { ProductDetailsSkeleton } from "@/components/products/product-loading-state";
import { formatCurrency } from "@/lib/format";
import { useProduct } from "@/lib/hooks/use-product";
import { addToCart } from "@/store/cart-slice";
import { useAppDispatch } from "@/store/hooks";

interface ProductDetailsViewProps {
  productId: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";

const COLOR_OPTIONS = [
  { name: "White", value: "white", swatchClass: "bg-[#f2f2f2] border-[#8d8d8d]" },
  { name: "Blue", value: "blue", swatchClass: "bg-[#070f9d] border-[#070f9d]" },
  { name: "Black", value: "black", swatchClass: "bg-black border-black" },
];

const SIZE_OPTIONS = ["XL", "L", "M", "S"];

export function ProductDetailsView({ productId }: ProductDetailsViewProps) {
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError, error } = useProduct(productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [expandedSection, setExpandedSection] = useState<"description" | "size-fit" | null>(
    "description",
  );

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load product"
        description={error instanceof Error ? error.message : "Please try again."}
      />
    );
  }

  const galleryImages = product.images.length ? product.images : [FALLBACK_IMAGE];
  const paddedGallery =
    galleryImages.length >= 4
      ? galleryImages
      : Array.from({ length: 4 }, (_, index) => galleryImages[index % galleryImages.length]);
  const safeImageIndex = Math.min(selectedImageIndex, paddedGallery.length - 1);
  const selectedImage = paddedGallery[safeImageIndex] || FALLBACK_IMAGE;
  const selectedColorLabel =
    COLOR_OPTIONS.find((option) => option.value === selectedColor)?.name ?? "White";

  const designerLabel = product.title
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
    .toUpperCase();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    message.success("Item added to bag.");
  };

  return (
    <div className="space-y-7">
      <nav className="flex flex-wrap items-center gap-3 text-[15px] text-[#8c8c8c]">
        <Link href="/" className="transition hover:text-[#3a3a3a]">
          Home
        </Link>
        <span>›</span>
        <span>Clothing</span>
        <span>›</span>
        <span>{product.category.name}</span>
        <span>›</span>
        <span className="text-[#3a3a3a]">{product.title}</span>
      </nav>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,980px)_minmax(380px,1fr)]">
        <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-6">
          <div className="hidden flex-col gap-5 sm:flex">
            {paddedGallery.map((image, index) => {
              const isActive = index === safeImageIndex;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden border transition ${
                    isActive ? "border-[#6e6e6e]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} preview ${index + 1}`}
                    width={84}
                    height={104}
                    className="aspect-[4/5] h-full w-full object-cover"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-sm bg-[#d7c9b3]">
            <Image
              src={selectedImage}
              alt={product.title}
              width={1200}
              height={1500}
              className="aspect-[4/5] h-full w-full object-cover"
              unoptimized
            />

            <div className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center justify-between">
              <button
                type="button"
                className="pointer-events-auto text-6xl font-light text-black/70 transition hover:text-black"
                onClick={() =>
                  setSelectedImageIndex(
                    (previous) => (previous - 1 + paddedGallery.length) % paddedGallery.length,
                  )
                }
                aria-label="View previous product image"
              >
                ‹
              </button>
              <button
                type="button"
                className="pointer-events-auto text-6xl font-light text-black/70 transition hover:text-black"
                onClick={() =>
                  setSelectedImageIndex((previous) => (previous + 1) % paddedGallery.length)
                }
                aria-label="View next product image"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-semibold uppercase tracking-[0.03em] text-[#222226]">
            {designerLabel || "LOSODE"}
          </h1>

          <h2 className="text-[28px] leading-[1.3] text-[#1f1f1f]">{product.title}</h2>

          <p className="text-4xl font-semibold text-[#121212]">
            {formatCurrency(product.price, "NGN")}
          </p>

          <div className="space-y-3">
            <p className="text-[17px] text-[#2f2f2f]">Colour: {selectedColorLabel}</p>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((option) => {
                const isActive = selectedColor === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedColor(option.value)}
                    aria-label={`Select ${option.name} colour`}
                    className={`h-11 w-11 rounded-full border ${option.swatchClass} ${
                      isActive ? "ring-2 ring-black ring-offset-2 ring-offset-[#ededed]" : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[17px] text-[#262626]">
              <span>Size:</span>
              <button type="button" className="underline underline-offset-2">
                View Size Guide
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-3 py-2 text-[18px] transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-[#c9c9c9] text-[#2d2d2d]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="h-14 w-full rounded-md bg-black px-6 text-[17px] text-white transition hover:bg-[#101010]"
            onClick={handleAddToCart}
          >
            Add to Bag
          </button>

          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-md border border-[#606060] px-6 text-[17px] text-[#2a2a2a] transition hover:bg-white/60"
            onClick={() => message.info("Item saved.")}
          >
            <HeartOutlineIcon />
            Save Item
          </button>

          <div className="divide-y divide-[#cfcfcf] border-y border-[#cfcfcf]">
            <DetailsSection
              title="Item Description"
              expanded={expandedSection === "description"}
              onToggle={() =>
                setExpandedSection((previous) => (previous === "description" ? null : "description"))
              }
            >
              <p className="max-w-5xl text-[18px] leading-8 text-[#2f2f2f]">
                {product.description}
              </p>
            </DetailsSection>

            <DetailsSection
              title="Size And Fit"
              expanded={expandedSection === "size-fit"}
              onToggle={() =>
                setExpandedSection((previous) => (previous === "size-fit" ? null : "size-fit"))
              }
            >
              <p className="text-[18px] leading-8 text-[#2f2f2f]">
                Regular fit. Select your usual size for a tailored finish.
              </p>
            </DetailsSection>
          </div>
        </div>
      </section>
    </div>
  );
}

interface DetailsSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function DetailsSection({ title, expanded, onToggle, children }: DetailsSectionProps) {
  return (
    <section className="py-5">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-[18px] font-semibold text-[#181818]"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="text-[28px] leading-none">{expanded ? "−" : "+"}</span>
      </button>

      {expanded ? <div className="pt-4">{children}</div> : null}
    </section>
  );
}

function HeartOutlineIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        d="M19.08 4.65A5.5 5.5 0 0 0 12 5.95a5.5 5.5 0 0 0-7.08-1.3A5.43 5.43 0 0 0 3.7 12.5L12 20.3l8.3-7.8a5.43 5.43 0 0 0-1.22-7.85Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
