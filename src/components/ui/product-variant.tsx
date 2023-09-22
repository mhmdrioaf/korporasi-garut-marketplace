"use client";

import { IProduct, IProductVariant } from "@/lib/globals";
import { useState } from "react";
import { Button } from "./button";
import { CheckIcon } from "lucide-react";

interface ProductVariantProps {
  product: IProduct;
  variants: IProductVariant[] | null;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
}

export default function ProductVariantsHandler({
  product,
  variants,
  setTotalPrice,
}: ProductVariantProps) {
  const [withVariants, setWithVariants] = useState<boolean>(false);
  const [variantsValue, setVariantsValue] = useState<string | null>(null);

  const onVariantsOptionsChangeHandler = (value: boolean) => {
    if (value === false) {
      setVariantsValue(null);
      setTotalPrice(product.price ?? 0);
    } else {
      setTotalPrice((prev) => prev + 12000);
    }
    setWithVariants(value);
  };

  const onVariantsValueChangeHandler = (color: string) => {
    if (!withVariants) onVariantsOptionsChangeHandler(true);
    setVariantsValue(color);
  };

  if (!variants) return null;
  else if (variants.length < 1) return null;
  else
    return (
      <>
        <div className="w-fit flex flex-row items-center rounded-md border border-input">
          <Button
            variant={withVariants ? "default" : "ghost"}
            onClick={() => onVariantsOptionsChangeHandler(true)}
          >
            Dengan {variants[0].variant_title}
          </Button>
          <Button
            variant={!withVariants ? "default" : "ghost"}
            onClick={() => onVariantsOptionsChangeHandler(false)}
          >
            Tanpa {variants[0].variant_title}
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Warna {variants[0].variant_title}</p>

          <div className="flex flex-row gap-4 items-center">
            {variants.map((variant) => (
              <div
                key={variant.variant_id}
                className={`w-8 h-8 grid place-items-center rounded-full bg-[${variant.variant_value.replace(
                  /^"(.+(?="$))"$/,
                  "$1"
                )}] cursor-pointer`}
                onClick={() =>
                  onVariantsValueChangeHandler(variant.variant_value)
                }
              >
                {variantsValue === variant.variant_value ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </>
    );
}
