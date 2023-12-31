"use client";

import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";

export default function ProductVariants() {
  const { variants, product } = useDirectPurchase();

  if (product.variant) {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-sm font-bold">
          Harap memilih variant, jika tidak memilih, akan kami kirim secara
          acak.
        </p>
        <div className="w-full grid grid-cols-2 gap-2">
          <p>{product.variant.variant_title}</p>
          <div className="w-full grid grid-cols-3 gap-2">
            {product.variant.variant_item.map((item) => (
              <div
                key={item.variant_item_id}
                className={`p-1 w-full rounded-sm border border-input cursor-pointer text-center select-none ${
                  variants.variantValue?.variant_item_id ===
                  item.variant_item_id
                    ? "bg-green-950 text-white font-bold"
                    : ""
                }`}
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
