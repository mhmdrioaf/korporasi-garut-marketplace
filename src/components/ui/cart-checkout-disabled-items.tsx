"use client";

import { rupiahConverter } from "@/lib/helper";
import { IProductsBySeller } from "@/lib/hooks/context/cartContextType";
import Image from "next/image";

interface ICartCheckoutDisabledItemsProps {
  disabledItems: IProductsBySeller;
}

export default function CartCheckoutDisabledItems({
  disabledItems,
}: ICartCheckoutDisabledItemsProps) {
  const sellers = Object.keys(disabledItems);
  const getSellerItems = () => {
    for (const seller of sellers) {
      return disabledItems[Number(seller)];
    }
  };

  const getSellerAddress = (seller: TSeller) => {
    const sellerAddress = seller.address.find(
      (address) => address.address_id === seller.primary_address_id
    );
    const sellerCity = sellerAddress?.city.city_name;

    return sellerCity ?? "Garut";
  };

  const sellerItems = getSellerItems() ?? {};
  const itemsIds = Object.keys(sellerItems);

  return itemsIds.length > 0 ? (
    <div className="w-full flex flex-col gap-2 text-sm">
      <div className="w-full flex flex-col gap-2 divide-y-2">
        <div className="w-full flex flex-row items-center justify-between py-2">
          <p className="font-bold">Barang yang tidak dapat dikirim</p>
        </div>

        {itemsIds.length > 0 &&
          itemsIds.map((id) => (
            <div key={id} className="w-full flex flex-row gap-2">
              <div className="w-16 h-16 relative">
                <Image
                  src={sellerItems[id].product.images[0]}
                  alt={sellerItems[id].product.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <p className="font-bold">{sellerItems[id].product.title}</p>
                <p>
                  {rupiahConverter(
                    sellerItems[id].variant?.variant_price ??
                      sellerItems[id].product.price
                  )}
                </p>
                <p className="text-red-500">
                  Barang hanya dapat dikirimkan di sekitar{" "}
                  {getSellerAddress(sellerItems[id].product.seller)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : null;
}
