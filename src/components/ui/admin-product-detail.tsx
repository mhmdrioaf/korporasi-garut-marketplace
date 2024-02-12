"use client";

import { Container } from "./container";
import Image from "next/image";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface IAdminProductDetailComponentProps {
  product: TProduct;
}

export default function AdminProductDetailComponent({
  product,
}: IAdminProductDetailComponentProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const onActiveImageChange = (index: number) => {
    setActiveImageIndex(index);
  };
  const showVariantItems = (items: TProductVariantItem[]) => {
    const itemsName = items.map((item) => item.variant_name);
    const joinnedItems = itemsName.join(", ");
    return joinnedItems;
  };

  return (
    <Container className="grid grid-cols-2 gap-4 relative">
      <div className="w-full overflow-hidden flex flex-col gap-2 sticky top-0 left-0">
        <div className="w-80 h-auto aspect-square relative rounded-md overflow-hidden">
          <Image
            src={remoteImageSource(product.images[activeImageIndex])}
            fill
            className="object-cover"
            sizes="100vw"
            alt={`Foto produk ${product.title}`}
          />
        </div>
        <div className="w-full flex flex-row items-center gap-2 overflow-auto">
          {product.images.map((image, index: number) => (
            <div
              className="w-20 h-auto aspect-square shrink-0 relative rounded-md overflow-hidden cursor-pointer"
              key={image}
              onClick={() => onActiveImageChange(index)}
            >
              <Image
                src={remoteImageSource(image)}
                fill
                className="object-cover"
                sizes="100vw"
                alt={`Foto produk ${product.title}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-stone-500 uppercase">Nama Kategori</p>
            <p className="text-3xl font-bold">{product.title}</p>
          </div>

          <div className="flex flex-col gap-2">
            {product.variant && (
              <>
                <p className="font-bold">Varian Produk</p>
                <div className="flex flex-row items-center gap-4">
                  <p>{product.variant.variant_title}</p>
                  <p>{showVariantItems(product.variant.variant_item)}</p>
                </div>
              </>
            )}
          </div>

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
            <p className="text-sm uppercase text-stone-500">Harga Produk</p>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-xl font-bold">
                {rupiahConverter(product.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
