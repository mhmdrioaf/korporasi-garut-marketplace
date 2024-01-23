"use client";

import {
  advancedProductIdentifications,
  highestProductsSellingWeekly,
  identifyProducts,
  lowestSellingProducts,
  remoteImageSource,
  rupiahConverter,
} from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import Image from "next/image";
import { Separator } from "./separator";

export default function AdminProductsIdentifications() {
  const { reports, products } = useAdmin();

  const identifyAdvancedProductsData = () => {
    if (products.data) {
      const productsData = advancedProductIdentifications(products.data);
      return productsData;
    } else {
      return null;
    }
  };

  const advancedProductsData = identifyAdvancedProductsData();

  if (reports.sales.data) {
    const productsData = identifyProducts(reports.sales.data);
    const highestSellingWeekly = highestProductsSellingWeekly(
      reports.sales.data
    );
    return (
      <div className="w-full flex flex-col gap-4">
        {productsData.ids.length > 0 && (
          <>
            <div className="w-full flex flex-col gap-2 rounded-md overflow-hidden p-2">
              <p className="font-bold">Produk terjual</p>
              {productsData.ids.map((id, idx) => (
                <div className="w-full grid grid-cols-2" key={id}>
                  {productsData.products && (
                    <>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                          <Image
                            src={remoteImageSource(
                              productsData.products[idx][id].images[0]
                            )}
                            fill
                            className="object-cover"
                            alt="Foto produk"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-xl">
                            {productsData.products[idx][id].name}
                          </p>
                          <p className="text-xs">
                            {productsData.products[idx][id].seller}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 justify-self-end self-center">
                        <p className="font-bold">Total terjual:</p>
                        <p>{productsData.products[idx][id].quantity}</p>
                        <p className="font-bold">Total pendapatan:</p>
                        <p>
                          {rupiahConverter(
                            productsData.products[idx][id].quantity *
                              productsData.products[idx][id].price
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {productsData.highestSelling && (
          <>
            <Separator />
            <div className="w-full flex flex-col gap-2 bg-green-500 text-white rounded-md overflow-hidden p-2">
              <p className="font-bold">Produk dengan penjualan tertinggi </p>
              <div className="w-full grid grid-cols-2">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={remoteImageSource(
                        productsData.highestSelling.images[0]
                      )}
                      fill
                      className="object-cover"
                      alt="Foto produk"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xl">
                      {productsData.highestSelling.name}
                    </p>
                    <p className="text-xs">
                      {productsData.highestSelling.seller}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-self-end self-center">
                  <p className="font-bold">Total terjual:</p>
                  <p>{productsData.highestSelling.quantity}</p>
                  <p className="font-bold">Total pendapatan:</p>
                  <p>
                    {rupiahConverter(
                      productsData.highestSelling.quantity *
                        productsData.highestSelling.price
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {highestSellingWeekly && (
          <>
            <Separator />
            <div className="w-full flex flex-col gap-2 bg-primary text-white rounded-md overflow-hidden p-2">
              <p className="font-bold">
                Produk dengan penjualan tertinggi minggu ini
              </p>
              <div className="w-full grid grid-cols-2">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={remoteImageSource(highestSellingWeekly.images[0])}
                      fill
                      className="object-cover"
                      alt="Foto produk"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xl">
                      {highestSellingWeekly.name}
                    </p>
                    <p className="text-xs">{highestSellingWeekly.seller}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-self-end self-center">
                  <p className="font-bold">Total terjual:</p>
                  <p>{highestSellingWeekly.quantity}</p>
                  <p className="font-bold">Total pendapatan:</p>
                  <p>
                    {rupiahConverter(
                      highestSellingWeekly.quantity * highestSellingWeekly.price
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />
        {products.data && lowestSellingProducts(products.data).length > 0 && (
          <div className="w-full flex flex-col gap-2 bg-red-400 text-white rounded-md overflow-hidden p-2">
            <p className="font-bold">Produk dengan penjualan terendah </p>
            {lowestSellingProducts(products.data).map((product) => (
              <div className="w-full grid grid-cols-2" key={product.id}>
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={remoteImageSource(product.images[0])}
                      fill
                      className="object-cover"
                      alt="Foto produk"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xl">{product.title}</p>
                    <p className="text-xs">
                      {product.seller.account.user_name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-self-end self-center">
                  <p className="font-bold">Total terjual:</p>
                  <p>{product.sold_count}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator />
        {advancedProductsData && (
          <div className="w-full flex flex-col gap-4">
            {advancedProductsData.search && (
              <div className="w-full flex flex-col gap-2 p-2 rounded-md border border-input">
                <p className="font-bold">Produk yang paling banyak di cari</p>

                <div className="w-full grid grid-cols-2">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                      <Image
                        src={remoteImageSource(
                          advancedProductsData.search.images[0]
                        )}
                        fill
                        className="object-cover"
                        alt="Foto produk"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <b>{advancedProductsData.search.title}</b>
                      <p className="text-xs">
                        {advancedProductsData.search.seller.account.user_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 justify-self-end self-center">
                    <p className="font-bold">Total pencarian:</p>
                    <p>{advancedProductsData.search.search_count} kali</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {advancedProductsData.view && (
              <div className="w-full flex flex-col gap-2 p-2 rounded-md border border-input">
                <p className="font-bold">Produk yang paling banyak di lihat</p>

                <div className="w-full grid grid-cols-2">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                      <Image
                        src={remoteImageSource(
                          advancedProductsData.view.images[0]
                        )}
                        fill
                        className="object-cover"
                        alt="Foto produk"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <b>{advancedProductsData.view.title}</b>
                      <p className="text-xs">
                        {advancedProductsData.view.seller.account.user_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 justify-self-end self-center">
                    <p className="font-bold">Total dilihat:</p>
                    <p>{advancedProductsData.view.visitor} kali</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {advancedProductsData.cart && (
              <div className="w-full flex flex-col gap-2 p-2 rounded-md border border-input">
                <p className="font-bold">
                  Produk yang paling banyak di tambahkan kedalam keranjang
                </p>

                <div className="w-full grid grid-cols-2">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-20 h-auto aspect-square relative rounded-md overflow-hidden">
                      <Image
                        src={remoteImageSource(
                          advancedProductsData.cart.images[0]
                        )}
                        fill
                        className="object-cover"
                        alt="Foto produk"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <b>{advancedProductsData.cart.title}</b>
                      <p className="text-xs">
                        {advancedProductsData.cart.seller.account.user_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 justify-self-end self-center">
                    <p className="font-bold">
                      Total produk dalam keranjang konsumen:
                    </p>
                    <p>
                      {advancedProductsData.cart.cart_count}{" "}
                      {advancedProductsData.cart.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
