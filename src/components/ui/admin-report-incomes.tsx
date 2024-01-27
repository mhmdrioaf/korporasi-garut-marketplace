"use client";

import {
  getPeriodTime,
  getSalesYears,
  getSellerIncomes,
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
import AdminReportIncomesPDF from "./admin-incomes-report-export-pdf";

interface IReportProps {
  adminName: string;
}

export default function AdminReportIncomes({ adminName }: IReportProps) {
  const { reports } = useAdmin();

  const startDate = reports.sales.date?.from;
  const endDate = reports.sales.date?.to;

  const periodYears = () => {
    if (reports.sales.data) {
      if (startDate && endDate) {
        if (startDate.getFullYear() !== endDate.getFullYear()) {
          return `${startDate.getFullYear()} & ${endDate.getFullYear()}`;
        } else {
          return startDate.getFullYear().toString();
        }
      } else {
        return getSalesYears(reports.sales.data).join(" & ");
      }
    } else {
      return new Date().getFullYear().toString();
    }
  };

  const periodMonths = getPeriodTime(
    startDate?.getMonth() ?? 0,
    endDate?.getMonth() ?? 12
  );

  if (reports.sales.data) {
    const sellerIncomes = getSellerIncomes(reports.sales.data);
    return (
      <div className="w-full flex flex-col gap-4">
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

        <Separator />
        <AdminReportIncomesPDF
          reportsData={reports.sales.data}
          period={{
            month: `${periodMonths.start} sampai dengan ${periodMonths.end}`,
            year: periodYears(),
          }}
          adminName={adminName}
        />
      </div>
    );
  }
}
