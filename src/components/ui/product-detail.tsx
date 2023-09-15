"use client";

import { IProduct } from "@/lib/globals";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
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

interface ProductDetailComponentProps {
  product: IProduct | null;
}

export default function ProductDetail({
  product,
}: ProductDetailComponentProps) {
  const [withPot, setWithPot] = useState<boolean>(false);
  const [potColor, setPotColor] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(product?.price ?? 0);
  const [productQuantity, setProductQuantity] = useState(0);

  const tempStock = 5;
  const tempProductUnit = "Pot";

  const onPotOptionsChangeHandler = (value: boolean) => {
    if (value === false) {
      setPotColor(null);
      setTotalPrice(product?.price ?? 0);
    } else {
      setTotalPrice((prev) => prev + 12000);
    }
    setWithPot(value);
  };

  const onPotColorChangeHandler = (color: string) => {
    if (!withPot) onPotOptionsChangeHandler(true);
    setPotColor(color);
  };

  const onQuantityChangeHandler = (option: "increase" | "decrease") => {
    if (option === "increase") {
      setProductQuantity((prev) => (prev === tempStock ? prev : prev + 1));
    } else {
      setProductQuantity((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  const onQuantityInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (value > tempStock) {
      setProductQuantity(tempStock);
    } else if (value < 0) {
      setProductQuantity(0);
    } else {
      setProductQuantity(value);
    }
  };

  return product ? (
    <Container variant="column" className="overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Product images */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-auto aspect-square rounded-lg overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt="Foto produk"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="w-full flex flex-row gap-2 items-center overflow-auto">
              {product.images.map((source) => (
                <div
                  key={source}
                  className="w-48 h-auto shrink-0 aspect-square rounded-lg overflow-hidden relative"
                >
                  <Image
                    src={source}
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
            href="/"
            className="text-primary font-bold flex flex-row items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <p>Kembali ke Marketplace</p>
          </Link>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-stone-500 uppercase">Nama Kategori</p>
            <p className="text-3xl font-bold">{product.title}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              {[...Array(5)].map((_, idx) => (
                <StarIcon
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  key={idx}
                />
              ))}
            </div>

            <p className="text-xs font-bold">{"5.0 (25 Penilaian)"}</p>
          </div>

          <div className="w-fit flex flex-row items-center rounded-md border border-input">
            <Button
              variant={withPot ? "default" : "ghost"}
              onClick={() => onPotOptionsChangeHandler(true)}
            >
              Dengan Pot
            </Button>
            <Button
              variant={!withPot ? "default" : "ghost"}
              onClick={() => onPotOptionsChangeHandler(false)}
            >
              Tanpa Pot
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-bold">Warna Pot</p>

            <div className="flex flex-row gap-4 items-center">
              <div
                className="w-8 h-8 grid place-items-center rounded-full bg-green-900 cursor-pointer"
                onClick={() => onPotColorChangeHandler("green")}
              >
                {potColor === "green" ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : null}
              </div>

              <div
                className="w-8 h-8 grid place-items-center rounded-full bg-red-900 cursor-pointer"
                onClick={() => onPotColorChangeHandler("red")}
              >
                {potColor === "red" ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : null}
              </div>

              <div
                className="w-8 h-8 grid place-items-center rounded-full bg-blue-900 cursor-pointer"
                onClick={() => onPotColorChangeHandler("blue")}
              >
                {potColor === "blue" ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : null}
              </div>

              <div
                className="w-8 h-8 grid place-items-center rounded-full bg-stone-900 cursor-pointer"
                onClick={() => onPotColorChangeHandler("stone")}
              >
                {potColor === "stone" ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : null}
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
              <AccordionContent>{product.descriptions}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-1">
            <p className="text-sm uppercase text-stone-500">Total Harga</p>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-xl font-bold">Rp. {totalPrice}</p>
              {withPot && (
                <p className="text-sm font-bold text-green-950">+ Harga Pot</p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-fit rounded-md flex flex-row items-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onQuantityChangeHandler("decrease")}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                max={tempStock}
                value={productQuantity}
                onChange={onQuantityInputChangeHandler}
                className="w-[6ch] text-center appearance-none"
              />
              <Button
                variant="default"
                size="icon"
                onClick={() => onQuantityChangeHandler("increase")}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
              <p className="text-sm font-bold">
                Stok tersedia: {tempStock} {tempProductUnit}
              </p>
            </div>
            <div className="w-full flex flex-row gap-2 items-center">
              <Button variant="default" className="w-full">
                Beli Sekarang
              </Button>
              <Button variant="outline" className="w-full">
                Tambahkan ke Keranjang
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Separator />

      <div className="w-full p-2 border border-input rounded-md flex flex-col gap-4">
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
      </div>
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
