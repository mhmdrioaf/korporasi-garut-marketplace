"use client";

import Modal from "./modal";
import { ScrollArea } from "./scroll-area";
import Image from "next/image";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ArrowUpRightFromCircleIcon } from "lucide-react";

interface IProductDetailModalComponentProps {
  product: TProduct;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  open,
  onClose,
}: IProductDetailModalComponentProps) {
  const productIdentificationsData = [
    {
      title: "Total Dilihat",
      value: `${product.visitor} pengunjung`,
    },
    {
      title: "Total Dicari",
      value: `${product.search_count} kali`,
    },
    {
      title: "Total Terjual",
      value: `${product.sold_count} ${product.unit}`,
    },
    {
      title: "Total Produk dalam Keranjang",
      value: `${product.cart_count} ${product.unit}`,
    },
  ];

  const productPrices = () => {
    if (product.variant) {
      const variantPrices = product.variant.variant_item.map(
        (item) => item.variant_price
      );
      const prices = [product.price, ...variantPrices];
      const maxPrice = prices.reduce(
        (acc, curr) => Math.max(acc, curr),
        -Infinity
      );
      const minPrice = Math.min(...prices);
      return {
        default: product.price,
        min: minPrice,
        max: maxPrice,
      };
    } else {
      return {
        default: product.price,
        min: 0,
        max: 0,
      };
    }
  };

  const showProductPrices = () => {
    const prices = productPrices();

    if (prices.min > 0) {
      return `${rupiahConverter(prices.min)} - ${rupiahConverter(prices.max)}`;
    } else {
      return `${rupiahConverter(prices.default)}`;
    }
  };

  const showProductStatus = () => {
    if (product.status === "PENDING") {
      return "Dalam Pengajuan";
    } else if (product.status === "APPROVED") {
      return "Telah Disetujui";
    } else {
      return "Ditolak";
    }
  };
  return open ? (
    <Modal defaultOpen={open} onClose={onClose}>
      <ScrollArea className="w-full h-[85vh] p-2">
        <div className="w-full flex flex-col gap-4">
          <p className="text-2xl font-bold text-primary">{product.title}</p>
          <Separator />

          <div className="w-full flex flex-row items-center justify-stretch gap-2 overflow-x-auto">
            {product.images.map((image) => (
              <div
                key={image}
                className="w-[30%] shrink-0 h-auto aspect-square relative rounded-sm overflow-hidden"
              >
                <Image
                  src={remoteImageSource(image)}
                  fill
                  alt={product.title}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <Separator />
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

          <div className="w-full flex flex-col gap-2">
            <b className="text-sm">Data Produk</b>
            <Separator />

            <div className="flex flex-row items-center justify-between gap-2 text-sm w-full">
              <div className="flex flex-row items-center gap-1">
                <b>Harga</b>
                <p>:</p>
                <p>{showProductPrices()}</p>
              </div>

              <div className="flex flex-row items-center gap-1">
                <b>Status Produk</b>
                <p>:</p>
                <p>{showProductStatus()}</p>
              </div>
            </div>
            <Separator />
          </div>

          {product.variant && (
            <div className="w-full flex flex-col gap-2">
              <b className="text-sm">Data Varian Produk</b>
              <Separator />
              <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">No</TableHead>
                    <TableHead>Nama Varian</TableHead>
                    <TableHead>Harga Varian</TableHead>
                    <TableHead>Stok</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {product.variant.variant_item.map((item, index) => (
                    <TableRow key={item.variant_item_id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{item.variant_name}</TableCell>
                      <TableCell>
                        {rupiahConverter(item.variant_price)}
                      </TableCell>
                      <TableCell>
                        {item.variant_stock} {product.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <b>Total Stok Tersedia</b>
                    </TableCell>

                    <TableCell className="text-right">
                      <b>
                        {product.variant.variant_item.reduce(
                          (a, b) => a + b.variant_stock,
                          0
                        )}{" "}
                        {product.unit}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <Separator />
            </div>
          )}

          <div className="w-full flex flex-col gap-2">
            <b className="text-sm">Statistik Produk</b>
            <Separator />
            <div className="w-full grid grid-cols-2 gap-4">
              {productIdentificationsData.map((data) => (
                <div
                  key={data.title}
                  className="col-span-1 flex flex-col gap-1 text-sm"
                >
                  <p className="font-bold">{data.title}</p>
                  <p>{data.value}</p>
                </div>
              ))}
              {!product.variant && (
                <div className="col-span-1 flex flex-col gap-1 text-sm">
                  <b>Total Stok Tersedia</b>
                  <p>
                    {product.stock} {product.unit}
                  </p>
                </div>
              )}
            </div>
          </div>

          {product.message && (
            <div className="w-full flex flex-col gap-1 bg-destructive px-4 py-2 rounded-sm">
              <b className="text-sm text-destructive-foreground font-bold">
                Alasan Penolakan
              </b>
              <p className="text-xs text-destructive-foreground">
                {product.message}
              </p>
            </div>
          )}

          {product.status === "APPROVED" && (
            <Button asChild className="w-full" variant="default">
              <Link
                target="_blank"
                href={ROUTES.PRODUCT.DETAIL(product.id.toString())}
              >
                <span className="mr-2">Lihat Produk Live</span>
                <ArrowUpRightFromCircleIcon className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </ScrollArea>
    </Modal>
  ) : null;
}
