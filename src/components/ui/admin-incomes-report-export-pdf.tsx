"use client";

import {
  getCurrentDateString,
  getSellerIncomes,
  rupiahConverter,
} from "@/lib/helper";
import Image from "next/image";
import { useRef } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import generatePDF, { Margin } from "react-to-pdf";
import { Button } from "./button";

interface IAdminReportIncomesPDFProps {
  reportsData: TSalesReportData[];
  period?: {
    month: string;
    year: string;
  };
  adminName: string;
}

export default function AdminReportIncomesPDF({
  reportsData,
  period,
  adminName,
}: IAdminReportIncomesPDFProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const sellerIncomes = getSellerIncomes(reportsData);

  const exportPDF = () => {
    generatePDF(divRef, {
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

      <div className="w-[1054px] hidden flex-col gap-4" ref={divRef}>
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
          LAPORAN PENDAPATAN PENJUAL PERIODE {period?.month.toUpperCase()} TAHUN{" "}
          {period?.year}
        </p>

        <p>
          Berikut ini merupakan detail pendapatan penjualan pada periode{" "}
          {period?.month} tahun {period?.year} :
        </p>

        {sellerIncomes.sellerIds.length > 0 && (
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama Penjual</TableHead>
                <TableHead>Produk Terjual</TableHead>
                <TableHead>Pendapatan</TableHead>
                <TableHead>Pengembangan Produk {"(50%)"}</TableHead>
                <TableHead>Tabungan Siswa {"(20%)"}</TableHead>
                <TableHead>Pendapatan Bersih {"(30%)"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerIncomes.sellerIds.map((sellerId, idx) => (
                <TableRow key={sellerId}>
                  <TableCell>{idx + 1}.</TableCell>
                  <TableCell>{sellerIncomes.incomes[sellerId].name}</TableCell>
                  <TableCell>
                    {sellerIncomes.incomes[sellerId].products.length} Produk
                  </TableCell>
                  <TableCell>
                    {rupiahConverter(sellerIncomes.incomes[sellerId].income)}
                  </TableCell>
                  <TableCell>
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId]
                        .product_development
                    )}
                  </TableCell>
                  <TableCell>
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId].student_savings
                    )}
                  </TableCell>
                  <TableCell>
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId].seller_income
                    )}
                  </TableCell>
                </TableRow>
              ))}

              <TableCell className="bg-primary text-white font-bold" />
              <TableCell className="bg-primary text-white font-bold">
                Total
              </TableCell>
              <TableCell className="bg-primary text-white font-bold">
                {sellerIncomes.totalIncomes.product_sold} Produk
              </TableCell>
              <TableCell className="bg-primary text-white font-bold">
                {rupiahConverter(sellerIncomes.totalIncomes.rawIncomes)}
              </TableCell>
              <TableCell className="bg-primary text-white font-bold">
                {rupiahConverter(
                  sellerIncomes.totalIncomes.product_development
                )}
              </TableCell>
              <TableCell className="bg-primary text-white font-bold">
                {rupiahConverter(sellerIncomes.totalIncomes.student_savings)}
              </TableCell>
              <TableCell className="bg-primary text-white font-bold">
                {rupiahConverter(sellerIncomes.totalIncomes.seller_income)}
              </TableCell>
            </TableBody>
          </Table>
        )}

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
    </>
  );
}
