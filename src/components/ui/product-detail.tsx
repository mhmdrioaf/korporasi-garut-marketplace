"use client";

import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangleIcon,
  ArrowLeft,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "./button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Separator } from "./separator";
import { Input } from "./input";
import { ROUTES } from "@/lib/constants";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import ProductVariants from "./product-variant";
import ProductDirectPurchase from "./product-direct-purchase";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import VariantChooser from "./variant-chooser";

export default function ProductDetail() {
  const { product, image, price, variants, cart, quantity, state } =
    useDirectPurchase();
  const getSellerAddress = () => {
    const primarySellerId = product.seller.primary_address_id;
    const primaryAddress = product.seller.address.find(
      (address) => address.address_id === primarySellerId
    );

    return primaryAddress ? primaryAddress.city.city_name : "Tidak diketahui";
  };
  return product ? (
    <Container variant="column" className="overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Product images */}
        <div className="col-span-1 flex flex-col gap-2 overflow-hidden">
          <div className="w-full h-auto aspect-square rounded-lg overflow-hidden relative">
            <Image
              src={remoteImageSource(product.images[image.activeImage])}
              alt="Foto produk"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="w-full flex flex-row gap-2 items-center overflow-auto">
              {product.images.map((source, index) => (
                <div
                  key={source}
                  className="w-48 h-auto shrink-0 aspect-square rounded-lg overflow-hidden relative cursor-pointer"
                  onClick={() => image.setActiveImage(index)}
                >
                  <Image
                    src={remoteImageSource(source)}
                    alt="Foto produk"
                    fill
                    sizes="75vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-8">
          <Link
            href={ROUTES.LANDING_PAGE}
            className="text-primary font-bold flex flex-row items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <p>Kembali ke Marketplace</p>
          </Link>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-stone-500 uppercase">
              {product.category?.category_name}
            </p>
            <p className="text-3xl font-bold">{product.title}</p>
          </div>

          <div className="w-full flex flex-row items-center gap-2">
            {product.seller.account.profile_picture && (
              <div className="w-8 h-8 rounded-sm overflow-hidden relative">
                <Image
                  src={remoteImageSource(
                    product.seller.account.profile_picture
                  )}
                  fill
                  className="object-cover"
                  alt="foto penjual"
                  sizes="75vw"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">
                {product.seller.account.user_name}
              </p>
              <p className="text-xs">{getSellerAddress()}</p>
            </div>
          </div>

          {/* TODO: Product ratings */}
          {/* <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              {[...Array(5)].map((_, idx) => (
                <StarIcon
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  key={idx}
                />
              ))}
            </div>

            <p className="text-xs font-bold">{"5.0 (25 Penilaian)"}</p>
          </div> */}

          <ProductVariants />

          <Accordion
            type="single"
            collapsible
            defaultValue="product-descriptions"
          >
            <AccordionItem value="product-descriptions">
              <AccordionTrigger>Deskripsi Produk</AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                {product.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-1">
            <p className="text-sm uppercase text-stone-500">Total Harga</p>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-xl font-bold">
                {rupiahConverter(price.totalPrice)}
              </p>
              {price.totalPrice !== product.price && variants.withVariants && (
                <p className="text-sm font-bold text-green-950">
                  + Harga Varian
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            {state.isWarning && (
              <div className="w-full bg-yellow-400 text-stone-500 flex flex-row gap-2 items-center justify-center px-2 py-2 rounded-sm font-medium">
                <AlertTriangleIcon className="w-4 h-4" />
                <p>
                  Harap pilih varian produk, jika tidak akan kami kirim secara
                  acak.
                </p>
              </div>
            )}

            {state.isPreorder && (
              <div className="w-full bg-blue-400 text-stone-50 grid place-items-center px-2 py-2 rounded-sm font-medium">
                <b>
                  Pesanan ini merupakan pesanan pre-order, karena saat ini
                  permintaan untuk produk ini sedang tinggi.
                </b>
              </div>
            )}

            <div className="w-fit rounded-md flex flex-row items-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => quantity.handler.onQuantityChange("decrease")}
                disabled={quantity.productQuantity === 1}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min={1}
                max={product.stock}
                value={quantity.productQuantity}
                onChange={quantity.handler.onQuantityInputChange}
                className="w-[9ch] text-center appearance-none"
              />
              <Button
                variant="default"
                size="icon"
                onClick={() => quantity.handler.onQuantityChange("increase")}
                disabled={quantity.productQuantity === product.stock}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
              <p className="text-sm font-bold">
                Stok tersedia:{" "}
                {variants.withVariants
                  ? variants.variantValue?.variant_stock
                  : product.stock}{" "}
                {product.unit}
              </p>
            </div>

            <div className="w-full flex flex-row gap-2 items-center">
              <ProductDirectPurchase />
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  state.isWarning
                    ? variants.handler.showVariantChooser("cart")
                    : cart.handler.onAddToCart()
                }
                disabled={cart.loading}
              >
                Tambahkan ke Keranjang
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Separator />

      {/* TODO: Product Reviews */}
      {/* <div className="w-full p-2 border border-input rounded-md flex flex-col gap-4">
        <p className="text-xl font-bold">Penilaian Produk</p>

        <div className="w-full p-2 border border-input flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <p className="font-bold">Nama Reviewer</p>
            <div className="w-1 h-1 bg-stone-950 rounded-sm" />
            <div className="flex flex-row items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <p className="font-bold">4</p>
            </div>
          </div>
          <p className="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque
            omnis quaerat ducimus ullam error?
          </p>
        </div>
      </div> */}

      <VariantChooser
        isOpen={state.isVariantChooserOpen}
        variant={product.variant}
      />
    </Container>
  ) : (
    <Container className="w-full h-screen grid place-items-center gap-2">
      <p className="text-2xl text-stone-700">Oopss...</p>
      <p className="text-base text-stone-500">
        Produk tidak ditemukan, silahkan coba lagi nanti...
      </p>
    </Container>
  );
}
