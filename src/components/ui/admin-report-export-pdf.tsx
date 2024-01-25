"use client";

import {
  getCurrentDateString,
  getDateWithoutTime,
  getSellerIncomes,
  reportMessage,
  rupiahConverter,
  sortReportsData,
} from "@/lib/helper";
import Image from "next/image";
import { useRef } from "react";
import generatePDF, { Margin } from "react-to-pdf";
import { Button } from "./button";
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

interface IAdminReportExportPDFProps {
  reportsData: TSalesReportData[];
  period?: {
    month: string;
    year: string;
  };
}

export default function AdminReportExportPDF({
  reportsData,
  period,
}: IAdminReportExportPDFProps) {
  const tableRef = useRef(null);
  const reports = sortReportsData(reportsData);

  const tablesHeaders = [
    "No.",
    "ID Pesanan",
    "Tanggal Pesanan",
    "Nama Produk",
    "Varian Produk",
    "Qty",
    "Harga",
    "Total Harga",
  ];
  //   index + 1,
  //   report.order_id,
  //   getDateString(report.order_date),
  //   report.order_item.length > 1
  //     ? report.order_item.map((item) => item.product.title).join("\n")
  //     : report.order_item[0].product.title,
  //   report.order_item.length > 1
  //     ? report.order_item
  //         .map((item) => (item.variant ? item.variant.variant_name : "-"))
  //         .join("\n")
  //     : report.order_item[0].variant
  //       ? report.order_item[0].variant.variant_name
  //       : "-",
  //   report.order_item.map((item) => item.order_quantity).join("\n"),
  //   report.order_item
  //     .map((item) =>
  //       rupiahConverter(
  //         item.variant ? item.variant.variant_price : item.product.price
  //       )
  //     )
  //     .join("\n"),
  //   report.order_item
  //     .map((item) =>
  //       rupiahConverter(
  //         item.variant
  //           ? item.variant.variant_price * item.order_quantity
  //           : item.product.price * item.order_quantity
  //       )
  //     )
  //     .join("\n"),
  // ]);

  const tablesData = reports.map((report, index) => ({
    no: index + 1,
    order_id: report.order_id,
    order_date: getDateWithoutTime(report.order_date),
    product_title:
      report.order_item.length > 1
        ? report.order_item.map((item) => item.product.title).join("\n")
        : report.order_item[0].product.title,
    variant_name:
      report.order_item.length > 1
        ? report.order_item
            .map((item) => (item.variant ? item.variant.variant_name : "-"))
            .join("\n")
        : report.order_item[0].variant
          ? report.order_item[0].variant.variant_name
          : "-",
    order_quantity: report.order_item
      .map((item) => item.order_quantity)
      .join("\n"),
    price: report.order_item
      .map((item) =>
        rupiahConverter(
          item.variant ? item.variant.variant_price : item.product.price
        )
      )
      .join("\n"),
    total_price: rupiahConverter(
      report.order_item.reduce(
        (a, b) =>
          a +
          (b.variant ? b.variant.variant_price : b.product.price) *
            b.order_quantity,
        0
      )
    ),
  }));

  const totalPrice = reports.reduce(
    (a, b) =>
      a +
      b.order_item.reduce(
        (c, d) =>
          c +
          d.order_quantity *
            (d.variant ? d.variant.variant_price : d.product.price),
        0
      ),
    0
  );

  const exportPDF = () => {
    generatePDF(tableRef, {
      filename: "laporan-penjualan.pdf",
      method: "open",
      page: {
        format: "letter",
        orientation: "l",
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

  return (
    <>
      <Button variant="outline" onClick={exportPDF}>
        Unduh Laporan
      </Button>

      <div className="w-[1054px] hidden flex-col gap-4" ref={tableRef}>
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

        <p className="font-bold text-center">
          LAPORAN PENJUALAN PERIODE {period?.month.toUpperCase()} TAHUN{" "}
          {period?.year}
        </p>

        <div className="flex flex-col gap-2">
          <p>{`Berikut adalah laporan penjualan dari periode ${period?.month} tahun ${period?.year}.`}</p>
          <p>{reportMessage(reports)}</p>
        </div>

        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              {tablesHeaders.map((header) => (
                <TableHead
                  key={header}
                  className="bg-primary text-white font-bold border border-white text-center"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {tablesData.map((data, index) => (
              <TableRow key={index + 1}>
                <TableCell className="text-center border border-input">
                  {data.no}
                </TableCell>
                <TableCell className="border border-input">
                  {data.order_id}
                </TableCell>
                <TableCell className="border border-input">
                  {data.order_date}
                </TableCell>
                <TableCell className="whitespace-pre border border-input">
                  {data.product_title}
                </TableCell>
                <TableCell className="whitespace-pre border border-input">
                  {data.variant_name}
                </TableCell>
                <TableCell className="text-center whitespace-pre border border-input">
                  {data.order_quantity}
                </TableCell>
                <TableCell className="text-center whitespace-pre border border-input">
                  {data.price}
                </TableCell>
                <TableCell className="text-center border border-input">
                  {data.total_price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="bg-primary text-white">
              <TableCell
                colSpan={7}
                className="text-right font-bold border border-input"
              >
                Total
              </TableCell>
              <TableCell className="text-center font-bold border border-input">
                {rupiahConverter(totalPrice)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className="w-52 flex flex-col justify-end items-end gap-16 self-end">
          <div className="w-full flex flex-col gap-2">
            <p>Garut, {getCurrentDateString()}</p>
            <p>Mengetahui,</p>
          </div>

          <div className="w-full flex flex-row items-center">
            <p>{"("}</p>
            <div className="w-full h-1 border-b border-dashed border-black self-end justify-self-end" />
            <p>{")"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
