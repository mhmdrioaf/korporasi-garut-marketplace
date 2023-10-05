"use client";

import { TProduct, TProductVariant, TProductVariantItem } from "@/lib/globals";

interface IProductVariantProps {
  product: TProduct;
  variants: TProductVariant[] | null;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setWithVariants: React.Dispatch<React.SetStateAction<boolean>>;
  setVariantsValue: React.Dispatch<React.SetStateAction<string | null>>;
  variantsValue: string | null;
  withVariants: boolean;
}

export default function ProductVariants({
  product,
  variants,
  setTotalPrice,
  withVariants,
  setVariantsValue,
  variantsValue,
  setWithVariants,
}: IProductVariantProps) {
  const onVariantsChangeHandler = (item: TProductVariantItem) => {
    setTotalPrice(product.price);
    if (variantsValue && variantsValue === item.variant_item_id) {
      setWithVariants(true);
      setVariantsValue(null);
      setTotalPrice(product.price);
    } else if (item.variant_price === 0) {
      setWithVariants(true);
      setVariantsValue(item.variant_item_id);
      setTotalPrice(product.price);
    } else {
      setWithVariants(true);
      setVariantsValue(item.variant_item_id);
      setTotalPrice((prev) => prev + item.variant_price);
    }
  };

  if (variants && variants.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-sm font-bold">
          Harap memilih variant, jika tidak memilih, akan kami kirim secara
          acak.
        </p>
        {variants.map((variant) => (
          <div
            key={variant.variant_id}
            className="w-full grid grid-cols-2 gap-2"
          >
            <p>{variant.variant_title}</p>
            <div className="w-full grid grid-cols-4 gap-2">
              {variant.variant_item.map((item) => (
                <div
                  key={item.variant_item_id}
                  className={`p-1 w-full rounded-sm border border-input cursor-pointer text-center select-none ${
                    variantsValue === item.variant_item_id
                      ? "bg-green-950 text-white font-bold"
                      : ""
                  }`}
                  onClick={() => onVariantsChangeHandler(item)}
                >
                  <p>{item.variant_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}
