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
    if (variantsValue && variantsValue === item.variant_item_id) {
      setWithVariants(false);
      setVariantsValue(null);
      setTotalPrice((prev) => prev - item.variant_price);
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

// import { TProduct, TProductVariant } from "@/lib/globals";
// import { useState } from "react";
// import { Button } from "./button";
// import { CheckIcon } from "lucide-react";

// interface IProductVariantProps {
//   product: TProduct;
//   variants: TProductVariant[] | null;
//   setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
// }

// export default function ProductVariantsHandler({
//   product,
//   variants,
//   setTotalPrice,
// }: IProductVariantProps) {
//   const [withVariants, setWithVariants] = useState<boolean>(false);
//   const [variantsValue, setVariantsValue] = useState<string | null>(null);

//   const onVariantsOptionsChangeHandler = (value: boolean) => {
//     if (value === false) {
//       setVariantsValue(null);
//       setTotalPrice(product.price ?? 0);
//     } else {
//       setTotalPrice((prev) => prev + 12000);
//     }
//     setWithVariants(value);
//   };

//   const onVariantsValueChangeHandler = (color: string) => {
//     if (!withVariants) onVariantsOptionsChangeHandler(true);
//     setVariantsValue(color);
//   };

//   if (!variants) return null;
//   else if (variants.length < 1) return null;
//   else
//     return (
//       <>
//         <div className="w-fit flex flex-row items-center rounded-md border border-input">
//           <Button
//             variant={withVariants ? "default" : "ghost"}
//             onClick={() => onVariantsOptionsChangeHandler(true)}
//           >
//             Dengan {variants[0].variant_title}
//           </Button>
//           <Button
//             variant={!withVariants ? "default" : "ghost"}
//             onClick={() => onVariantsOptionsChangeHandler(false)}
//           >
//             Tanpa {variants[0].variant_title}
//           </Button>
//         </div>

//         <div className="flex flex-col gap-1">
//           <p className="font-bold">Warna {variants[0].variant_title}</p>

//           <div className="flex flex-row gap-4 items-center">
//             {variants.map((variant) => (
//               <div
//                 key={variant.variant_id}
//                 className={`w-8 h-8 grid place-items-center rounded-full bg-[${variant.variant_value.replace(
//                   /^"(.+(?="$))"$/,
//                   "$1"
//                 )}] cursor-pointer`}
//                 onClick={() =>
//                   onVariantsValueChangeHandler(variant.variant_value)
//                 }
//               >
//                 {variantsValue === variant.variant_value ? (
//                   <CheckIcon className="w-4 h-4 text-primary-foreground" />
//                 ) : null}
//               </div>
//             ))}
//           </div>
//         </div>
//       </>
//     );
// }
