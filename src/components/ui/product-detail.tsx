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
import {
  getMonthString,
  remoteImageSource,
  rupiahConverter,
} from "@/lib/helper";
import ProductVariants from "./product-variant";
import ProductDirectPurchase from "./product-direct-purchase";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import VariantChooser from "./variant-chooser";
import SameDayProductAlert from "./modals/same-day-product-alert";
import Alert from "@/components/ui/modals/alert";

export default function ProductDetail() {
  const { product, image, price, variants, cart, quantity, state, handler } =
    useDirectPurchase();
  const getSellerAddress = () => {
    const primarySellerId = product.seller.primary_address_id;
    const primaryAddress = product.seller.address.find(
      (address) => address.address_id === primarySellerId
    );

    return primaryAddress ? primaryAddress.city.city_name : "Tidak diketahui";
  };

  const productAvaibility = () => {
    let date = new Date();
    date.setDate(date.getDate() + 5);

    const dateString = date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return dateString;
  };

  const preorderAlertMessage = () => {
    let productName = "";
    let productType = "";
    if (product) {
      if (variants.variantValue) {
        productName = variants.variantValue.variant_name;
        productType = "Varian";
      } else {
        productName = product.title;
        productType = "Produk";
      }
    }

    return `${productType} ${productName} sedang tidak tersedia. ${productType} ini akan tersedia kembali pada tanggal ${productAvaibility()}.\n\nJika anda berkenan untuk melakukan pesanan pre-order, maka minimal pembelian untuk produk ini adalah 5 ${product.unit}, sehingga pesanan anda menjadi pesanan prioritas kami.\n\nTerima kasih.`;
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

        <div className="w-full block lg:hidden">
          <Separator />
        </div>

        <div className="w-full flex flex-col gap-4 lg:gap-8">
          <Link
            href={ROUTES.LANDING_PAGE}
            className="text-primary font-bold hidden lg:flex flex-row items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <p>Kembali ke Marketplace</p>
          </Link>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-stone-500 uppercase">
              {product.category?.category_name}
            </p>
            <p className="text-lg lg:text-2xl font-bold">{product.title}</p>
          </div>

          <Link
            href={ROUTES.USER.STORE_PROFILE(product.seller.user_id.toString())}
            className="w-full flex flex-row items-center gap-2"
          >
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
            <div className="text-sm lg:text-base flex flex-col gap-1">
              <p className="text-xs lg:text-sm font-bold">
                {product.seller.account.user_name}
              </p>
              <p className="text-xs">{getSellerAddress()}</p>
            </div>
          </Link>

          <Accordion
            type="single"
            collapsible
            defaultValue="product-descriptions"
            className="text-xs lg:text-base"
          >
            <AccordionItem value="product-descriptions">
              <AccordionTrigger>Deskripsi Produk</AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                <div className="text-xs lg:text-sm w-full flex flex-col gap-2">
                  <p>{product.description}</p>

                  <Separator />

                  <div className="w-full grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <b>Tanggal Kedaluwarsa</b>
                      <p>
                        {new Date(product.expire_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <b>Berat Produk</b>
                      <p>{product.weight} gram</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <b>Masa Penyimpanan</b>
                      <p>{product.storage_period} hari</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <b>Dapat dikirim ke luar kota</b>
                      <p>{product.capable_out_of_town ? "Ya" : "Tidak"}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ProductVariants />

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-xs lg:text-sm font-bold">Total Harga</p>
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
              <div className="w-full bg-yellow-300 text-stone-950 text-sm flex flex-row gap-2 items-center justify-center px-2 py-2 rounded-sm font-medium">
                <AlertTriangleIcon className="hidden md:block w-4 h-4" />
                <p>
                  Harap pilih varian produk, jika tidak akan kami kirim secara
                  acak.
                </p>
              </div>
            )}

            {state.isPreorder && (
              <div className="w-full bg-primary text-white text-xs lg:text-sm grid place-items-center px-2 py-2 rounded-sm">
                <b>
                  Pesanan ini merupakan pesanan <b>pre-order</b>, sehingga
                  minimal pembelian untuk produk ini adalah 5 {product.unit}.
                </b>
              </div>
            )}

            <div className="w-full md:w-fit rounded-md flex flex-col md:flex-row items-center gap-2 text-xs lg:text-base">
              <div className="w-full md:w-fit flex flex-row items-center gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  className="shrink-0"
                  onClick={() => quantity.handler.onQuantityChange("decrease")}
                  disabled={
                    state.isPreorder
                      ? quantity.productQuantity === 5
                      : quantity.productQuantity === 1
                  }
                >
                  <MinusIcon className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min={state.isPreorder ? 5 : 1}
                  max={
                    product.variant
                      ? variants.variantValue
                        ? variants.variantValue.variant_stock
                        : product.stock
                      : product.stock
                  }
                  value={quantity.productQuantity}
                  onChange={quantity.handler.onQuantityInputChange}
                  className="w-full md:w-[7ch] text-center appearance-none"
                />
                <Button
                  variant="default"
                  size="icon"
                  className="shrink-0"
                  onClick={() => quantity.handler.onQuantityChange("increase")}
                  disabled={
                    state.isPreorder
                      ? false
                      : variants.variantValue
                        ? variants.variantValue.variant_stock ===
                          quantity.productQuantity
                        : product.stock === quantity.productQuantity
                  }
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
              <p className="lg:text-sm font-bold">
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

      <VariantChooser
        isOpen={state.isVariantChooserOpen}
        variant={product.variant}
      />

      <SameDayProductAlert />
      <Alert
        isOpen={state.preorderModalOpen}
        message={preorderAlertMessage()}
        title={`Pesanan Pre-Order`}
        onConfirm={handler.onPreorderModalClose}
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
