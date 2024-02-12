"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { useRef } from "react";
import Image from "next/image";
import { getCurrentDateString } from "@/lib/helper";
import { Button } from "./button";
import generatePDF, { Margin } from "react-to-pdf";

interface IReportProps {
  adminName: string;
}

export default function AdminReportRestock({ adminName }: IReportProps) {
  const { products } = useAdmin();

  function getProductName(product: TProduct) {
    if (product.variant) {
      return product.variant.variant_item
        .filter((item) => item.variant_stock < 1)
        .map((item) => `${product.title} - ${item.variant_name}`)
        .join("\n");
    } else {
      return product.title;
    }
  }

  function getProductStock(product: TProduct) {
    if (product.variant) {
      return product.variant.variant_item
        .filter((item) => item.variant_stock < 1)
        .map((item) => `${item.variant_stock} ${product.unit}`)
        .join("\n");
    } else {
      return `${product.stock} ${product.unit}`;
    }
  }

  const divRef = useRef<HTMLDivElement>(null);

  const exportPDF = () => {
    generatePDF(divRef, {
      filename: "laporan-penjualan.pdf",
      method: "open",
      page: {
        format: "letter",
        orientation: "p",
        margin: Margin.MEDIUM,
      },
      overrides: {
        canvas: {
          onclone(_, element) {
            element.style.display = "flex";
          },
        },
      },
    });
  };

  return products.loading ? (
    <div className="w-full text-center">
      Memuat data produk yang perlu di restock...
    </div>
  ) : (
    <div className="w-full flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Stok Tersedia</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.data &&
            products.data
              .filter((product: TProduct) =>
                product.variant
                  ? product.variant.variant_item.some(
                      (item) => item.variant_stock < 1
                    )
                  : product.stock < 1
              )
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="whitespace-pre-line">
                    {getProductName(product)}
                  </TableCell>
                  <TableCell className="whitespace-pre-line">
                    {getProductStock(product)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <Button className="w-full" variant="outline" onClick={exportPDF}>
        Unduh Laporan
      </Button>

      <div className="w-full hidden flex-col gap-4" ref={divRef}>
        <div className="w-full flex flex-row gap-4 items-center px-4 py-2 text-primary">
          <div className="w-24 h-24 relative overflow-hidden">
            <Image src="/smk_logo.png" fill alt="SMK Logo" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">SMK Korporasi Garut</p>
            <p className="text-sm">Yayasan Pendidikan Galeuh Pakuwan</p>
            <p className="text-xs">
              Jl. Dalem Kasep No.7, Bluburlimbangan, Garut.
            </p>
          </div>
        </div>

        <div className="w-full h-1 bg-primary" />
        <div className="flex flex-col gap-4">
          <p className="text-center text-2xl font-bold">LAPORAN STOK BARANG</p>
          <p className="whitespace-pre-line">
            {`Kepada Tim Produksi,\n\nKami ingin memberitahukan bahwa berdasarkan laporan sistem kami, telah teridentifikasi beberapa item yang stoknya telah habis.\n\nSebagai langkah untuk memastikan kelancaran operasional kami dan memenuhi permintaan pelanggan, kami membutuhkan stok ulang untuk barang-barang berikut ini:`}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Stok Tersedia</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.data &&
              products.data
                .filter((product: TProduct) =>
                  product.variant
                    ? product.variant.variant_item.some(
                        (item) => item.variant_stock < 1
                      )
                    : product.stock < 1
                )
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="whitespace-pre-line">
                      {getProductName(product)}
                    </TableCell>
                    <TableCell className="whitespace-pre-line">
                      {getProductStock(product)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <p className="whitespace-pre-line">{`Kami menghargai kerjasama Anda dalam menangani permintaan stok ulang ini sesuai dengan prioritas yang diberikan.\n\nTerima kasih`}</p>

        <div className="w-fit flex flex-col justify-end items-end gap-16 self-end">
          <div className="w-full flex flex-col gap-2">
            <p>Garut, {getCurrentDateString()}</p>
            <p>Mengetahui,</p>
          </div>

          <div className="w-full flex flex-row items-center mb-4">
            <b>{adminName}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
