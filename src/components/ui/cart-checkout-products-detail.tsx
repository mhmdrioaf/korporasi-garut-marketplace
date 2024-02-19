"use client";

import {
  phoneNumberGenerator,
  remoteImageSource,
  rupiahConverter,
} from "@/lib/helper";
import { useCart } from "@/lib/hooks/context/useCart";
import Image from "next/image";
import { Button } from "./button";
import CartCheckoutShippingCost from "../cart-checkout-shipping-cost";
import { Loader2Icon } from "lucide-react";
import CartCheckoutDisabledItems from "./cart-checkout-disabled-items";

export default function CartCheckoutProductsDetail() {
  const { cart, checkout, state } = useCart();

  const isDisabledItems = Object.keys(checkout.disabledItems).length > 0;
  const isSamedayCouriersSelected =
    Object.keys(state.sameDayCourier).length +
      Object.keys(checkout.chosenCourier).length ===
    checkout._sellers.length;
  const isCouriersSelected =
    Object.keys(checkout.chosenCourier).length === checkout._sellers.length;

  const isCheckoutButtonDisabled =
    checkout._sellers.length > 0
      ? state.sameDay
        ? isDisabledItems
          ? !isCouriersSelected
          : !isSamedayCouriersSelected
        : !isCouriersSelected
      : true;

  return checkout.step === 2 ? (
    <div className="w-full flex flex-col gap-2 text-sm">
      <div className="w-full flex flex-col gap-2 divide-y-2">
        <div className="w-full flex flex-row items-center justify-between py-2">
          <p className="font-bold">Detail Pengiriman</p>
          <Button
            variant="default"
            size="sm"
            onClick={() => checkout.handler.changeStep(1)}
          >
            Ubah
          </Button>
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <p>Penerima</p>
          <p>{checkout.chosenAddress!.recipient_name}</p>
          <p>Nomor telepon penerima</p>
          <p>
            {phoneNumberGenerator(
              checkout.chosenAddress!.recipient_phone_number
            )}
          </p>
          <p>Alamat Lengkap</p>
          <p>
            <span className="font-bold">
              {`${checkout.chosenAddress!.city.city_name}, ${
                checkout.chosenAddress!.city.province
              }`}
              ,{" "}
            </span>
            {checkout.chosenAddress!.full_address}
          </p>
        </div>

        {checkout._sellers.map((sellerID) => {
          const seller = checkout._items[parseInt(sellerID)][0].product.seller;
          const sellerAddresses = seller.address;
          const sellerPrimaryAddress = sellerAddresses.filter(
            (address) => address.address_id === seller.primary_address_id
          )[0];
          return (
            <div
              className="w-full flex flex-col gap-4 p-2 rounded-md"
              key={sellerID}
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold">
                  {cart.handler.getSellerName(parseInt(sellerID))}
                </p>
                <p className="text-sm">
                  {cart.handler.getSellerAddress(parseInt(sellerID) ?? "")}
                </p>
              </div>

              {checkout._items[parseInt(sellerID)].map((item) => (
                <div
                  className="w-full flex flex-col gap-1 py-2"
                  key={item.cart_item_id}
                >
                  <div className="w-full flex flex-row items-center gap-2">
                    <div className="w-16 h-16 rounded-md relative overflow-hidden">
                      <Image
                        src={remoteImageSource(item.product.images[0])}
                        fill
                        className="object-cover"
                        alt={item.product.title}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="font-bold">{item.product.title}</p>
                      <p>{rupiahConverter(checkout.handler.itemPrice(item))}</p>
                    </div>
                  </div>
                </div>
              ))}

              <CartCheckoutShippingCost
                sellerID={parseInt(sellerID)}
                sellerAddress={sellerPrimaryAddress}
                totalWeight={checkout.handler.totalWeight(
                  checkout._items[parseInt(sellerID)]
                )}
                items={checkout._items[parseInt(sellerID)]}
              />
            </div>
          );
        })}

        <CartCheckoutDisabledItems disabledItems={checkout.disabledItems} />

        <div className="w-full flex flex-col gap-2 py-2">
          {checkout._sellers.map((sellerID) => {
            const sellerName = cart.handler.getSellerName(parseInt(sellerID));
            const itemsPrice =
              checkout._totalSellerCost[parseInt(sellerID)].itemsCost;
            const shippingPrice =
              checkout._totalSellerCost[parseInt(sellerID)].shippingCost;

            const totalPrice = itemsPrice + shippingPrice;

            return (
              <div className="flex flex-col gap-2" key={sellerID}>
                <div className="grid grid-cols-3">
                  <p className="font-bold col-span-2">
                    Total Harga Produk dari {sellerName}
                  </p>
                  <p className="justify-self-end">
                    {rupiahConverter(totalPrice)}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-3">
            <p className="font-bold col-span-2">Jumlah yang harus di bayar: </p>
            <p className="justify-self-end">
              {rupiahConverter(checkout._totalCost)}
            </p>
          </div>
        </div>
      </div>
      <Button
        variant="default"
        disabled={isCheckoutButtonDisabled || checkout.loading}
        onClick={checkout.handler.order}
      >
        {isCheckoutButtonDisabled ? (
          <span>Harap pilih opsi pengiriman untuk setiap penjual.</span>
        ) : checkout.loading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <span>Melakukan pesanan...</span>
          </>
        ) : (
          "Pesan"
        )}
      </Button>
    </div>
  ) : null;
}
