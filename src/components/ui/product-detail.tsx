"use client";

import { TProduct, TProductVariantItem } from "@/lib/globals";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MinusIcon, PlusIcon, StarIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
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
import { useToast } from "./use-toast";
import ProductDirectPurchase from "./product-direct-purchase";

interface IProductDetailComponentProps {
  product: TProduct;
  user_id: string | null;
}

export default function ProductDetail({
  product,
  user_id,
}: IProductDetailComponentProps) {
  const [withVariants, setWithVariants] = useState<boolean>(false);
  const [variantsValue, setVariantsValue] =
    useState<TProductVariantItem | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(product.price);
  const [productQuantity, setProductQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { toast } = useToast();

  const onQuantityChangeHandler = (option: "increase" | "decrease") => {
    // TODO: Increase total amount based on quantity
    if (option === "increase") {
      setProductQuantity((prev) => (prev === product.stock ? prev : prev + 1));
      setTotalPrice((prev) =>
        variantsValue
          ? product.price + variantsValue.variant_price + prev
          : prev + product.price
      );
    } else {
      setProductQuantity((prev) => (prev === 1 ? 1 : prev - 1));
      setTotalPrice((prev) =>
        variantsValue
          ? prev - (variantsValue.variant_price + product.price)
          : prev - product.price
      );
    }
  };

  const onQuantityInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (!isNaN(value)) {
      if (value > product.stock) {
        setProductQuantity(product.stock);
        setTotalPrice(
          variantsValue
            ? (variantsValue.variant_price + product.price) * product.stock
            : product.price * product.stock
        );
      } else if (value < 1) {
        setProductQuantity(1);
        setTotalPrice(
          variantsValue
            ? variantsValue.variant_price + product.price
            : product.price
        );
      } else {
        setProductQuantity(value);
        setTotalPrice(
          variantsValue
            ? (variantsValue.variant_price + product.price) * value
            : product.price * value
        );
      }
    } else {
      setProductQuantity(1);
      setTotalPrice(
        variantsValue
          ? variantsValue.variant_price + product.price
          : product.price
      );
    }
  };

  const onAddToCart = () => {
    if (product.variant.length > 0 && !withVariants)
      toast({
        variant: "destructive",
        title: "Gagal menambahkan produk ke keranjang.",
        description:
          "Harap memilih salah satu variant untuk menambahkan ke keranjang.",
      });
    else {
      setWithVariants(false);
      setVariantsValue(null);
      setProductQuantity(1);
      setTotalPrice(product.price);
      toast({
        variant: "success",
        title: "Berhasil menambahkan produk ke keranjang.",
        description: "Produk telah berhasil ditambahkan ke keranjang anda.",
      });
      console.log({
        totalPrice: totalPrice,
        variantsValue: variantsValue,
        withVariants: withVariants,
        quantity: productQuantity,
        productId: product.id,
      });
    }
  };

  const onVariantsChangeHandler = (item: TProductVariantItem) => {
    setTotalPrice(product.price * productQuantity);
    if (
      variantsValue &&
      variantsValue.variant_item_id === item.variant_item_id
    ) {
      setWithVariants(false);
      setVariantsValue(null);
      setTotalPrice(product.price * productQuantity);
    } else if (item.variant_price === 0) {
      setWithVariants(false);
      setVariantsValue(item);
    } else {
      setWithVariants(true);
      setVariantsValue(item);
      setTotalPrice((product.price + item.variant_price) * productQuantity);
    }
  };

  return product ? (
    <Container variant="column" className="overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Product images */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-auto aspect-square rounded-lg overflow-hidden relative">
            <Image
              src={remoteImageSource(product.images[activeImageIndex])}
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
                  onClick={() => setActiveImageIndex(index)}
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

          <ProductVariants
            variants={product.variant}
            variantsValue={variantsValue}
            onVariantChange={onVariantsChangeHandler}
          />

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
              <p className="text-xl font-bold">{rupiahConverter(totalPrice)}</p>
              {totalPrice !== product.price && withVariants && (
                <p className="text-sm font-bold text-green-950">
                  + Harga Varian
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-fit rounded-md flex flex-row items-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onQuantityChangeHandler("decrease")}
                disabled={productQuantity === 1}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min={1}
                max={product.stock}
                value={productQuantity}
                onChange={onQuantityInputChangeHandler}
                className="w-[9ch] text-center appearance-none"
              />
              <Button
                variant="default"
                size="icon"
                onClick={() => onQuantityChangeHandler("increase")}
                disabled={productQuantity === product.stock}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
              <p className="text-sm font-bold">
                Stok tersedia: {product.stock} {product.unit}
              </p>
            </div>

            <div className="w-full flex flex-row gap-2 items-center">
              <ProductDirectPurchase
                product={product}
                product_quantity={productQuantity}
                product_variant={variantsValue}
                user_id={user_id}
                totalPrice={totalPrice}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={onAddToCart}
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
