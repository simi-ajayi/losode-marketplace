interface CartDisplayMeta {
  vendor: string;
  color: string;
  size: string;
}

interface CartItemLike {
  productId: number;
  title: string;
}

interface KnownMetaRule {
  matcher: RegExp;
  meta: CartDisplayMeta;
}

const KNOWN_META_RULES: KnownMetaRule[] = [
  {
    matcher: /folorunsho/i,
    meta: {
      vendor: "EYDNE",
      color: "Black",
      size: "2XL",
    },
  },
  {
    matcher: /montero/i,
    meta: {
      vendor: "KD CLOTHING",
      color: "Beige",
      size: "UK-42",
    },
  },
];

const FALLBACK_COLORS = ["Black", "Navy", "Beige", "White", "Grey"];
const FALLBACK_SIZES = ["XL", "L", "M", "S", "2XL"];

function getFallbackVendor(title: string) {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.toUpperCase());

  return words.join(" ") || "LOSODE";
}

export function getCartItemMeta(item: CartItemLike): CartDisplayMeta {
  const known = KNOWN_META_RULES.find((rule) => rule.matcher.test(item.title));

  if (known) {
    return known.meta;
  }

  return {
    vendor: getFallbackVendor(item.title),
    color: FALLBACK_COLORS[item.productId % FALLBACK_COLORS.length],
    size: FALLBACK_SIZES[item.productId % FALLBACK_SIZES.length],
  };
}
