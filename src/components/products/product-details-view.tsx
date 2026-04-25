"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Alert, message } from "antd";

import { ProductDetailsSkeleton } from "@/components/products/product-loading-state";
import { AppButton } from "@/components/ui/app-button";
import { SectionToggleButton } from "@/components/ui/section-toggle-button";
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
  { name: "White", value: "white", swatchClass: "!bg-[#f2f2f2] !border-[#8d8d8d]" },
  { name: "Blue", value: "blue", swatchClass: "!bg-[#070f9d] !border-[#070f9d]" },
  { name: "Black", value: "black", swatchClass: "!bg-black !border-black" },
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
    <div className="space-y-7 px-4 py-6 sm:px-7 sm:py-8 xl:px-15 2xl:px-20 lg:py-9">
      <nav className="flex flex-wrap items-center gap-3 text-[14px] font-mono text-[#8c8c8c]">
        <Link href="/" className="transition hover:text-[#3a3a3a]">
          Home
        </Link>
        <RightOutlined className="text-[12px]" />
        <span>Clothing</span>
        <RightOutlined className="text-[12px]" />
        <span>{product.category.name}</span>
        <RightOutlined className="text-[12px]" />
        <span className="text-[#3a3a3a]">{product.title}</span>
      </nav>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,50%)_minmax(50%,1fr)]">
        <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-6">
          <div className="hidden flex-col gap-5 sm:flex">
            {paddedGallery.map((image, index) => {
              const isActive = index === safeImageIndex;

              return (
                <AppButton
                  key={`${image}-${index}`}
                  variant="outline"
                  uiSize="icon"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`!h-auto !w-full !rounded-none !border-[3px] !p-0 ${
                    isActive ? "!border-[#000]" : "!border-transparent"
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
                </AppButton>
              );
            })}
          </div>

          <div className="relative overflow-hidden px-10">
            <Image
              src={selectedImage}
              alt={product.title}
              width={1200}
              height={1500}
              className="aspect-[4/5] h-[90vh] w-full object-cover"
              unoptimized
            />

            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between px-10">
              <AppButton
                variant="text"
                uiSize="icon"
                className="!h-auto !w-auto !p-0 !text-6xl !font-light !text-black/70 hover:!text-black"
                onClick={() =>
                  setSelectedImageIndex(
                    (previous) =>
                      (previous - 1 + paddedGallery.length) %
                      paddedGallery.length,
                  )
                }
                aria-label="View previous product image"
              >
                <LeftOutlined />
              </AppButton>
              <AppButton
                variant="text"
                uiSize="icon"
                className="!h-auto !w-auto !p-0 !text-6xl !font-light !text-black/70 hover:!text-black"
                onClick={() =>
                  setSelectedImageIndex(
                    (previous) => (previous + 1) % paddedGallery.length,
                  )
                }
                aria-label="View next product image"
              >
                <RightOutlined />
              </AppButton>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-4xl font-semibold uppercase tracking-[0.03em] text-[#222226]">
            {designerLabel || "LOSODE"}
          </div>

          <div className="text-[20px] leading-[1.3] text-[#1f1f1f]">
            {product.title}
          </div>

          <p className="text-lg font-semibold text-[#121212]">
            {formatCurrency(product.price, "NGN")}
          </p>

          <div className="space-y-3">
            <p className="text-[17px] text-[#2f2f2f]">
              Colour: {selectedColorLabel}
            </p>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((option) => {
                const isActive = selectedColor === option.value;

                return (
                  <AppButton
                    key={option.value}
                    variant="ghost"
                    uiSize="icon"
                    onClick={() => setSelectedColor(option.value)}
                    aria-label={`Select ${option.name} colour`}
                    className={`!h-11 !w-11 !rounded-full !border ${option.swatchClass} ${
                      isActive
                        ? "!ring-2 !ring-black !ring-offset-2 !ring-offset-[#ededed]"
                        : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[17px] text-[#262626]">
              <span>Size:</span>
              <AppButton
                variant="text"
                className="!h-auto !p-0 !text-[17px] !underline !underline-offset-2"
              >
                View Size Guide
              </AppButton>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <AppButton
                  key={size}
                  variant="outline"
                  onClick={() => setSelectedSize(size)}
                  className={`!h-7 !rounded-md !px-3 !py-2 !text-[18px] ${
                    selectedSize === size
                      ? "!border-black !text-[#2d2d2d] "
                      : "!border-[#c9c9c9] !text-[#2d2d2d]"
                  }`}
                >
                  {size}
                </AppButton>
              ))}
            </div>
          </div>

          <AppButton
            fullWidth
            variant="primary"
            className="!h-11 !rounded-md !px-6 !text-[17px]"
            onClick={handleAddToCart}
          >
            Add to Bag
          </AppButton>

          <AppButton
            fullWidth
            variant="outline"
            className="!h-11 !rounded-md !px-6 !text-[17px]"
            onClick={() => message.info("Item saved.")}
          >
            <HeartOutlined />
            Save Item
          </AppButton>

          <div className="divide-y">
            <DetailsSection
              title="Item Description"
              expanded={expandedSection === "description"}
              onToggle={() =>
                setExpandedSection((previous) =>
                  previous === "description" ? null : "description",
                )
              }
            >
              <p className="max-w-5xl !mx-4 text-[15px] leading-8 text-[#2f2f2f]">
                {product.description}
              </p>
            </DetailsSection>

            <DetailsSection
              title="Size And Fit"
              expanded={expandedSection === "size-fit"}
              onToggle={() =>
                setExpandedSection((previous) =>
                  previous === "size-fit" ? null : "size-fit",
                )
              }
            >
              <p className="text-[15px] mx-4 leading-8 text-[#2f2f2f]">
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
      <SectionToggleButton
        expanded={expanded}
        onClick={onToggle}
        label={title}
        className="!text-[18px] !font-semibold !text-[#181818]"
      />

      {expanded ? <div className="pt-4">{children}</div> : null}
    </section>
  );
}
