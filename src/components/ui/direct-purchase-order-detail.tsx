"use client";

import { Separator } from "./separator";
import {
  disableOrderButton,
  phoneNumberGenerator,
  remoteImageSource,
  rupiahConverter,
} from "@/lib/helper";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import DirectPurchaseShippingCost from "./direct-purchase-shipping-cost";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";

export default function DirectPurchaseOrderDetail() {
  const {
    order,
    customer,
    product,
    quantity,
    variants,
    price,
    shipping,
    handler,
    state,
  } = useDirectPurchase();

  const onChangeAddressClick = () => {
    order.setStep(1);
    shipping.setChosenCourier(null);
    customer.address.setChosenAddress(null);
    handler.resetPrice();
  };

  const onCancelClick = () => {
    order.setStep(null);
    shipping.setChosenCourier(null);
    customer.address.setChosenAddress(null);
    handler.resetPrice();
  };

  return order.handler.isModalOpen(2) ? (
    <div className="w-full flex flex-col gap-4 text-sm">
      <div className="w-full flex flex-col gap-2">
        <p className="text-base md:text-2xl font-bold text-primary">
          Detail Pemesanan
        </p>
        <p className="text-xs md:text-sm">
          Berikut merupakan detail pemesanan yang akan di lakukan, ketuk tombol{" "}
          {'"Lanjutkan"'} jika sudah sesuai.
        </p>
      </div>

      <Separator />
      <div className="w-full flex flex-row items-center justify-between">
        <p className="font-bold">Detail Pengiriman</p>
        <Button variant="default" size="sm" onClick={onChangeAddressClick}>
          Ubah Alamat
        </Button>
      </div>
      <div className="text-xs md:text-sm w-full flex flex-col gap-2">
        <div className="w-full flex flex-col gap-1">
          <b>Penerima</b>
          <p>{customer.address.chosenAddress!.recipient_name}</p>
        </div>

        <div className="w-full flex flex-col gap-1">
          <b>Nomor telepon penerima</b>
          <p>
            {phoneNumberGenerator(
              customer.address.chosenAddress!.recipient_phone_number
            )}
          </p>
        </div>

        <div className="w-full flex flex-col gap-1">
          <b>Alamat Lengkap</b>
          <p>{customer.address.chosenAddress!.full_address}</p>
        </div>
      </div>

      <Separator />
      <DirectPurchaseShippingCost />

      <p className="font-bold">Detail Produk</p>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="w-20 h-20 rounded-md overflow-hidden relative">
            <Image
              src={remoteImageSource(product.images[0])}
              fill
              alt="foto produk"
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">{product.title}</p>
            <div className="flex flex-row items-center gap-1">
              {product.seller.account.profile_picture && (
                <div className="w-8 h-8 rounded-sm overflow-hidden relative">
                  <Image
                    src={remoteImageSource(
                      product.seller.account.profile_picture
                    )}
                    alt="foto seller"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
              <p className="text-sm">{product.seller.account.user_name}</p>
            </div>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="product-descriptions"
        >
          <AccordionItem value="product-descriptions">
            <AccordionTrigger>Deskripsi Produk</AccordionTrigger>
            <AccordionContent className="whitespace-pre-wrap text-xs">
              {product.description}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="w-full flex flex-col gap-2 text-xs md:text-base">
          <p className="font-bold">Rincian Biaya</p>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-bold">Harga Barang</p>
            <p>
              {rupiahConverter(
                variants.variantValue
                  ? variants.variantValue.variant_price
                  : product.price
              )}
            </p>
            <p className="font-bold">Jumlah Barang</p>
            <p>
              {quantity.productQuantity} {product.unit}
            </p>
            {variants.variantValue && (
              <>
                <p className="font-bold">Varian Barang</p>
                <div className="flex flex-row items-center gap-1">
                  <p>{variants.variantValue.variant_name}</p>
                </div>
              </>
            )}
            <p className="font-bold">Total Harga</p>
            <p className="font-bold">{rupiahConverter(price.totalPrice)}</p>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        onClick={order.handler.placeOrder}
        disabled={disableOrderButton([
          order.loading,
          !shipping.sameDay.isSameDay && !shipping.chosenCourier,
          shipping.sameDay.isSameDay && !shipping.sameDay.courierSelected,
          !customer.address.chosenAddress,
        ])}
      >
        {order.loading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : !shipping.sameDay.isSameDay && !shipping.chosenCourier ? (
          "Harap pilih kurir yang tersedia"
        ) : shipping.sameDay.isSameDay && !shipping.sameDay.courierSelected ? (
          "Harap pilih kurir yang tersedia"
        ) : !customer.address.chosenAddress ? (
          "Harap pilih alamat pengiriman"
        ) : (
          "Lanjutkan Pemesanan"
        )}
      </Button>
      <Button variant="secondary" onClick={onCancelClick}>
        Batalkan
      </Button>
    </div>
  ) : null;
}
