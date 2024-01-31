"use client";

import { TProduct, TSellerProfile } from "@/lib/globals";
import { getStoreProducts, remoteImageSource } from "@/lib/helper";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { Separator } from "./separator";
import ProductCard from "./product-card";

interface IStoreProfileProps {
  store: TSellerProfile;
}

export default function StoreProfileComponent({ store }: IStoreProfileProps) {
  const getStoreAddress = () => {
    const primarySellerId = store.primary_address_id;
    const primaryAddress = store.address.find(
      (address) => address.address_id === primarySellerId
    );

    return primaryAddress ? primaryAddress.city.city_name : "Tidak diketahui";
  };
  const { popular, mostSearched, all } = getStoreProducts(store.products);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="w-24 h-24 rounded-md relative overflow-hidden border border-input flex items-center justify-center">
            {store.account.profile_picture ? (
              <Image
                src={remoteImageSource(store.account.profile_picture)}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon className="w-8 h-8" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-2xl text-primary font-bold">
              {store.account.user_name}
            </p>
            <p className="text-sm">{getStoreAddress()}</p>
          </div>
        </div>

        {popular.length > 0 && (
          <>
            <Separator />

            <div className="w-full flex flex-col gap-2">
              <p className="text-lg text-primary font-bold">Produk Populer</p>
              <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
                {popular.map((product) => (
                  <ProductCard product={product as TProduct} key={product.id} />
                ))}
              </div>
            </div>
          </>
        )}

        {mostSearched.length > 0 && (
          <>
            <Separator />

            <div className="w-full flex flex-col gap-2">
              <p className="text-lg text-primary font-bold">
                Produk Paling Dicari
              </p>
              <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
                {mostSearched.map((product) => (
                  <ProductCard product={product as TProduct} key={product.id} />
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="w-full flex flex-col gap-2">
          <p className="text-lg text-primary font-bold">Semua Produk</p>
          <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
            {all.map((product) => (
              <ProductCard product={product as TProduct} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
