import { ROUTES } from "@/lib/constants";
import { TProduct } from "@/lib/globals";
import {
  remoteImageSource,
  rupiahConverter,
  showProductSoldCount,
} from "@/lib/helper";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TProductCardProps = {
  product: TProduct;
};

export default function ProductCard({ product }: TProductCardProps) {
  const getSellerAddress = () => {
    const primarySellerId = product.seller.primary_address_id;
    const primaryAddress = product.seller.address.find(
      (address) => address.address_id === primarySellerId
    );

    return primaryAddress ? primaryAddress.city.city_name : "Tidak diketahui";
  };

  const productPrices = () => {
    if (product.variant) {
      const variantPrices = product.variant.variant_item.map(
        (item) => item.variant_price
      );
      const prices = [product.price, ...variantPrices];
      const maxPrice = prices.reduce(
        (acc, curr) => Math.max(acc, curr),
        -Infinity
      );
      const minPrice = Math.min(...prices);
      return {
        default: product.price,
        min: minPrice,
        max: maxPrice,
      };
    } else {
      return {
        default: product.price,
        min: 0,
        max: 0,
      };
    }
  };

  const showProductPrices = () => {
    const prices = productPrices();

    if (prices.min > 0) {
      return `${rupiahConverter(prices.min)} - ${rupiahConverter(prices.max)}`;
    } else {
      return `${rupiahConverter(prices.default)}`;
    }
  };

  return (
    <Link
      href={ROUTES.PRODUCT.DETAIL(product.id.toString())}
      className="w-full border border-stone-200 p-2 min-h-full max-h-96 overflow-hidden flex flex-col gap-2 rounded-lg select-none"
    >
      <div className="w-full h-32 bg-stone-200 shrink-0 rounded-md overflow-hidden relative">
        <Image
          src={remoteImageSource(product.images[0])}
          alt={product.title + " picture"}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <p
          title={product.title}
          className="text-sm md:text-base font-medium overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {product.title}
        </p>
        <p className="text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {product.description}
        </p>

        <div className="w-full items-center flex flex-row gap-2 justify-evenly md:justify-center">
          {/* TODO: Implement the product discount */}
          {/* <p className="text-xs font-medium line-through text-red-950">
            Rp. 25.000,.
          </p> */}
          <p className="text-xs md:text-base font-bold text-green-950">
            {showProductPrices()}
          </p>
        </div>

        <p className="text-xs text-center">
          Terjual: {showProductSoldCount(product.sold_count)} {product.unit}
        </p>

        <div className="hidden w-full md:flex items-center justify-between gap-2">
          <div className="w-full px-2 py-1 bg-green-950 rounded-md text-white grid place-items-center">
            <div className="flex flex-row items-center gap-2">
              <MapPinIcon className="w-4 h-4" />
              <p className="text-sm">{getSellerAddress()}</p>
            </div>
          </div>

          {product.category && (
            <div className="w-full px-2 py-1 bg-gray-950 rounded-md text-white grid place-items-center">
              <p className="text-sm">{product.category.category_name}</p>
            </div>
          )}
        </div>

        {/* TODO: Implement the rating & sold count */}
        {/* <div className="w-full flex items-center justify-evenly gap-4">
          <p className="text-sm text-stone-500">50+</p>
          <div className="w-px h-5 bg-stone-500" />
          <p className="text-sm text-stone-500">4.5</p>
        </div> */}
      </div>
    </Link>
  );
}
