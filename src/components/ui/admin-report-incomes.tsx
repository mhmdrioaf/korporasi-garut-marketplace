"use client";

import {
  getIncomesDetail,
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
  const { reports, incomes } = useAdmin();

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

  if (incomes.data.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
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
            {incomes.data.map((income, idx) => (
              <TableRow key={income.income_id}>
                <TableCell>{idx + 1}.</TableCell>
                <TableCell>{income.seller.account.user_name}</TableCell>
                <TableCell>{income.order.order_item.length} Produk</TableCell>
                <TableCell>{rupiahConverter(income.total_income)}</TableCell>
                <TableCell>
                  {rupiahConverter(getIncomesDetail(income).productDevelopment)}
                </TableCell>
                <TableCell>
                  {rupiahConverter(getIncomesDetail(income).studentSavings)}
                </TableCell>
                <TableCell>
                  {rupiahConverter(getIncomesDetail(income).sellerIncome)}
                </TableCell>
              </TableRow>
            ))}

            <TableCell className="bg-primary text-white font-bold" />
            <TableCell className="bg-primary text-white font-bold">
              Total
            </TableCell>
            <TableCell className="bg-primary text-white font-bold">
              {incomes.data.flatMap((income) =>
                income.order.order_item.reduce(
                  (a, b) => a + b.order_quantity,
                  0
                )
              )}{" "}
              Produk
            </TableCell>
            <TableCell className="bg-primary text-white font-bold">
              {rupiahConverter(
                incomes.data.reduce((a, b) => a + b.total_income, 0)
              )}
            </TableCell>
            <TableCell className="bg-primary text-white font-bold">
              {rupiahConverter(
                incomes.data.reduce((a, b) => a + b.total_income * 0.5, 0)
              )}
            </TableCell>
            <TableCell className="bg-primary text-white font-bold">
              {rupiahConverter(
                incomes.data.reduce((a, b) => a + b.total_income * 0.2, 0)
              )}
            </TableCell>
            <TableCell className="bg-primary text-white font-bold">
              {rupiahConverter(
                incomes.data.reduce((a, b) => a + b.total_income * 0.3, 0)
              )}
            </TableCell>
          </TableBody>
        </Table>

        <Separator />
        <AdminReportIncomesPDF
          incomes={incomes.data}
          period={{
            month: `${periodMonths.start} sampai dengan ${periodMonths.end}`,
            year: periodYears(),
          }}
          adminName={adminName}
        />
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-center text-lg font-bold">
          Data pendapatan penjual tidak ditemukan
        </p>
      </div>
    );
  }
}
