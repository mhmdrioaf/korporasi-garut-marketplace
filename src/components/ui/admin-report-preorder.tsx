"use client";

import {
  estimatedTimeArrivalGenerator,
  getCurrentDateString,
} from "@/lib/helper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { Button } from "./button";
import React from "react";
import generatePDF, { Margin } from "react-to-pdf";
import Image from "next/image";

interface IReportProps {
  adminName: string;
}

export default function PreorderReport({ adminName }: IReportProps) {
  const { reports } = useAdmin();
  const preorders = reports.preorders.data;

  const divRef = React.useRef<HTMLDivElement>(null);

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

  return preorders && preorders.length > 0 ? (
    <div className="w-full flex flex-col gap-4">
      <Table>
        <TableCaption />
        <TableHeader>
          <TableRow>
            <TableHead colSpan={5} className="text-center">
              DAFTAR PESANAN PREORDER
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center">ID Pesanan</TableHead>
            <TableHead className="text-center">Nama Produk</TableHead>
            <TableHead className="text-center">Varian</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead className="text-center">
              Batas Tanggal Produksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.preorders.state.loading ? (
            <TableRow>
              <TableCell colSpan={5} className="animate-pulse bg-stone-500" />
            </TableRow>
          ) : (
            preorders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{order.order_id}</TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((item) => item.product.title)
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((order) =>
                      order.variant ? order.variant.variant_name : "-"
                    )
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((order) => order.order_quantity)
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center">
                  {estimatedTimeArrivalGenerator(order.eta)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Button variant="outline" className="w-full" onClick={exportPDF}>
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
          <p className="text-center text-2xl font-bold">
            DAFTAR PESANAN PREORDER
          </p>
          <p>
            Berikut ini kami lampirkan daftar pesanan preorder. Produksi
            terhadap produk yang tertera dibawah ini harus segera dilakukan
            sebelum batas tanggal produksi yang tercantum.
          </p>
        </div>

        <Table>
          <TableCaption />
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID Pesanan</TableHead>
              <TableHead className="text-center">Nama Produk</TableHead>
              <TableHead className="text-center">Varian</TableHead>
              <TableHead className="text-center">Jumlah</TableHead>
              <TableHead className="text-center">
                Batas Tanggal Produksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {preorders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{order.order_id}</TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((item) => item.product.title)
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((order) =>
                      order.variant ? order.variant.variant_name : "-"
                    )
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center whitespace-pre-wrap">
                  {order.order_item
                    .map((order) => order.order_quantity)
                    .join("\n")}
                </TableCell>
                <TableCell className="text-center">
                  {estimatedTimeArrivalGenerator(order.eta)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="whitespace-pre-line">
          {
            "Mohon perhatian dan kerjasamanya dalam memastikan produk-produk tersebut diproduksi sesuai dengan jadwal yang telah ditetapkan.\n\nTerima kasih"
          }
        </p>
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
  ) : (
    <div className="w-full h-96 flex flex-col items-center justify-center gap-2">
      <p className="text-sm">Tidak ada data yang tersedia</p>
    </div>
  );
}
