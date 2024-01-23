"use client";

import { TProduct } from "@/lib/globals";
import Modal from "../modal";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import { decimalDate, rupiahConverter } from "@/lib/helper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Button } from "../button";

interface IAdminProductDetailModalProps {
  product: TProduct | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (options: "APPROVED" | "REJECTED", productId: string) => void;
}

export default function AdminProductDetailModal({
  product,
  open,
  onClose,
  onStatusChange,
}: IAdminProductDetailModalProps) {
  const productDetailData = product
    ? [
        {
          title: "Berat Produk",
          value: `${product.weight} gram`,
        },
        {
          title: "Stok Produk",
          value: `${
            product.variant
              ? product.variant.variant_item.reduce(
                  (a, b) => a + b.variant_stock,
                  0
                )
              : product.stock
          } ${product.unit}`,
        },
        {
          title: "Tanggal Kedaluwarsa",
          value: () => {
            const date = new Date(product.expire_date);
            const month = date.toLocaleString("id-ID", { month: "long" });
            const day = decimalDate(date.getDate());
            const years = date.getFullYear();

            return `${day} ${month} ${years}`;
          },
        },
        {
          title: "Masa Penyimpanan",
          value: `${product.storage_period} hari`,
        },
        {
          title: "Penjual",
          value: product.seller.account.user_name,
        },
        {
          title: "Total Varian Produk",
          value: `${
            product.variant ? product.variant.variant_item.length : 0
          } varian`,
        },
      ]
    : [];

  const productPrices = () => {
    if (product) {
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
    } else {
      return {
        default: 0,
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

  return open && product ? (
    <Modal defaultOpen={open} onClose={onClose}>
      <ScrollArea className="h-[85vh] p-2">
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold text-2xl text-primary">Detail Produk</p>

          <Separator />

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Nama Produk</p>
              <p>{product.title}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">Harga</p>
              <p>{showProductPrices()}</p>
            </div>
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

          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold" colSpan={2}>
                  Atribut Produk
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productDetailData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold">{item.title}</TableCell>
                  <TableCell>
                    {typeof item.value === "string" ? item.value : item.value()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {product.variant && (
            <div className="w-full flex flex-col gap-2">
              <Separator />
              <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-center" colSpan={4}>
                      Data Varian Produk
                    </TableHead>
                  </TableRow>
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

          {product.status !== "APPROVED" && (
            <Button
              variant="default"
              className="w-full"
              onClick={() => onStatusChange("APPROVED", product.id.toString())}
            >
              Setujui Produk
            </Button>
          )}

          {product.status !== "REJECTED" && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onStatusChange("REJECTED", product.id.toString())}
            >
              Tolak Produk
            </Button>
          )}
        </div>
      </ScrollArea>
    </Modal>
  ) : null;
}
