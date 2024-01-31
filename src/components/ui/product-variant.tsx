"use client";

import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";

export default function ProductVariants() {
  const { variants, product } = useDirectPurchase();

  const variantItemCardStyle = (itemID: string, selectedID: string) => {
    const baseStyle =
      "p-1 w-full rounded-sm text-sm border border-input cursor-pointer text-center select-none";
    const selectedStyle = `${baseStyle} bg-primary text-white font-bold`;

    if (itemID === selectedID) {
      return selectedStyle;
    } else {
      return baseStyle;
    }
  };

  if (product.variant) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold">Varian {product.variant.variant_title}</p>
          <div className="w-full grid grid-cols-2 gap-2">
            {product.variant.variant_item.map((item) => (
              <div
                key={item.variant_item_id}
                className={variantItemCardStyle(
                  variants.variantValue?.variant_item_id ?? "",
                  item.variant_item_id
                )}
                onClick={() => variants.handler.onVariantsChange(item)}
              >
                <p>{item.variant_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
