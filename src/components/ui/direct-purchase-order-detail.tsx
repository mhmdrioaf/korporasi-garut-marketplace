"use client";

import { TAddress, TProduct, TProductVariantItem } from "@/lib/globals";
import { Separator } from "./separator";
import {
  invoiceMaker,
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
import { useToast } from "./use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

interface IDirectPurchaseOrderDetailProps {
  shipping_address: TAddress;
  product: TProduct;
  user_id: string | null;
  product_quantity: number;
  product_variant: TProductVariantItem | null;
  totalPrice: number;
  isOpen: boolean;
  setOrderStep: (step: number | null) => void;
}

export default function DirectPurchaseOrderDetail({
  isOpen,
  shipping_address,
  product,
  product_quantity,
  product_variant,
  user_id,
  totalPrice,
  setOrderStep,
}: IDirectPurchaseOrderDetailProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const onOrder = async () => {
    setIsLoading(true);
    if (!user_id) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "User ID tidak ditemukan!",
      });
    } else {
      const makeOrder = await invoiceMaker(
        user_id,
        product,
        product_quantity,
        shipping_address,
        product_variant,
        totalPrice
      );
      if (!makeOrder.ok) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Terjadi kesalahan ketika melakukan pemesanan",
          description: makeOrder.message,
        });
      } else {
        setIsLoading(false);
        setOrderStep(3);
      }
    }
  };

  return isOpen ? (
    <div className="w-full flex flex-col gap-4 text-sm">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-bold text-primary">Detail Pemesanan</p>
        <p className="text-sm">
          Berikut merupakan detail pemesanan yang akan di lakukan, ketuk tombol{" "}
          {'"Lanjutkan"'} jika sudah sesuai.
        </p>
      </div>

      <Separator />
      <div className="w-full flex flex-row items-center justify-between">
        <p className="font-bold">Detail Pengiriman</p>
        <Button variant="default" size="sm" onClick={() => setOrderStep(1)}>
          Ubah
        </Button>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <p>Penerima</p>
        <p>{shipping_address.recipient_name}</p>
        <p>Nomor telepon penerima</p>
        <p>{phoneNumberGenerator(shipping_address.recipient_phone_number)}</p>
        <p>Alamat Lengkap</p>
        <p>
          <span className="font-bold">
            {`${shipping_address.city.city_name}, ${shipping_address.city.province}`}
            ,{" "}
          </span>
          {shipping_address.full_address}
        </p>
      </div>

      <Separator />
      <p className="font-bold">Detail Produk</p>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="w-20 h-20 rounded-md overflow-hidden relative">
            <Image
              src={remoteImageSource(product.images[0])}
              fill
              alt="foto produk"
              className="object-cover"
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

        <p className="font-bold">Rincian Biaya</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="font-bold">Harga Barang</p>
          <p>{rupiahConverter(product.price)}</p>
          <p className="font-bold">Jumlah Barang</p>
          <p>
            {product_quantity} {product.unit}
          </p>
          {product_variant && (
            <>
              <p className="font-bold">Varian Barang</p>
              <div className="flex flex-row items-center gap-1">
                <p>{product_variant.variant_name}</p>
                {product_variant.variant_price > 0 && (
                  <p className="text-green-950">
                    + {rupiahConverter(product_variant.variant_price)} /{" "}
                    {product.unit}
                  </p>
                )}
              </div>
            </>
          )}
          <p className="text-lg font-bold">Total Harga</p>
          <p className="text-lg font-bold">{rupiahConverter(totalPrice)}</p>
        </div>
      </div>

      <Button variant="default" onClick={onOrder} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          "Lanjutkan"
        )}
      </Button>
      <Button variant="secondary" onClick={() => setOrderStep(null)}>
        Batalkan
      </Button>
    </div>
  ) : null;
}
