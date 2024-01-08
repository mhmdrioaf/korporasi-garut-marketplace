"use client";

import {
  getMonthString,
  getSellerIncomes,
  getTotalIncome,
  rupiahConverter,
} from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export default function AdminReportIncomes() {
  const { reports } = useAdmin();

  const startDate = reports.sales.startDate
    ? new Date(reports.sales.startDate).getMonth()
    : 0;
  const endDate = reports.sales.endDate
    ? new Date(reports.sales.endDate).getMonth()
    : 11;

  if (reports.sales.data) {
    const sellerIncomes = getSellerIncomes(reports.sales.data);
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="font-bold text-lg">Pendapatan</p>
        <div className="grid grid-cols-2">
          <p className="font-bold">
            Total pendapatan {getMonthString(startDate, startDate + 1)} -{" "}
            {getMonthString(endDate, endDate + 1)} tahun {reports.sales.year}
          </p>
          <p className="font-bold self-center justify-self-end">
            {reports.sales.data
              ? rupiahConverter(getTotalIncome(reports.sales.data))
              : rupiahConverter(0)}
          </p>
        </div>

        <Separator />
        <p className="font-bold text-lg">Pendapatan Penjual</p>
        {sellerIncomes.sellerIds.length > 0 && (
          <Table>
            <TableCaption>Detail Pendapatan</TableCaption>
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
      </div>
    );
  }
}

{
  /* <div className="w-full flex flex-col gap-2" key={sellerId}>
                <p className="font-bold">
                  {sellerIncomes.incomes[sellerId].name}
                </p>
                <Separator />
                <div className="w-full grid grid-cols-2 gap-2">
                  <p className="font-bold">Total Pesanan</p>
                  <p className="font-bold justify-self-end self-center">
                    {sellerIncomes.incomes[sellerId].products.length} Produk
                  </p>
                  <p className="font-bold">
                    Total Pendapatan {sellerIncomes.incomes[sellerId].name}
                  </p>
                  <p className="font-bold justify-self-end self-center">
                    {rupiahConverter(sellerIncomes.incomes[sellerId].income)}
                  </p>
                  <p className="font-bold">
                    Pembagian Pengembangan Produk {"(50%)"}
                  </p>
                  <p className="font-bold justify-self-end self-center">
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId]
                        .product_development
                    )}
                  </p>
                  <p className="font-bold">
                    Pembagian Tabungan Siswa {"(20%)"}
                  </p>
                  <p className="font-bold justify-self-end self-center">
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId].student_savings
                    )}
                  </p>
                  <p className="font-bold">
                    Pendapatan Bersih {sellerIncomes.incomes[sellerId].name}{" "}
                    {"(30%)"}
                  </p>
                  <p className="font-bold justify-self-end self-center">
                    {rupiahConverter(
                      sellerIncomes.detailedIncomes[sellerId].seller_income
                    )}
                  </p>
                </div>
                <Separator />
              </div> */
}
