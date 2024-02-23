"use client";

import {
  getIncomeYears,
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
import { Button } from "./button";
import PayIncomeButton from "./pay-incomes-button";

interface IReportProps {
  adminName: string;
}

export default function AdminReportIncomes({ adminName }: IReportProps) {
  const { reports, incomes } = useAdmin();

  const startDate = reports.sales.date?.from;
  const endDate = reports.sales.date?.to;

  const periodYears = () => {
    if (startDate && endDate) {
      if (startDate.getFullYear() !== endDate.getFullYear()) {
        return `${startDate.getFullYear()} & ${endDate.getFullYear()}`;
      } else {
        return startDate.getFullYear().toString();
      }
    } else {
      return getIncomeYears(incomes.data).join(" & ");
    }
  };

  const periodMonths = getPeriodTime(
    startDate?.getMonth() ?? 0,
    endDate?.getMonth() ?? 12
  );

  const incomesData = {
    ALL: incomes.data,
    PENDING: incomes.data.filter(
      (income) => income.income_status === "PENDING"
    ),
    PAID: incomes.data.filter((income) => income.income_status === "PAID"),
  };

  if (incomes.data.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full grid grid-cols-3 gap-2">
          <Button
            variant={incomes.state.activeData === "ALL" ? "default" : "outline"}
            onClick={() => incomes.handler.changeActiveData("ALL")}
          >
            Semua Pendapatan
          </Button>
          <Button
            variant={
              incomes.state.activeData === "PENDING" ? "default" : "outline"
            }
            onClick={() => incomes.handler.changeActiveData("PENDING")}
          >
            Belum di Setor
          </Button>
          <Button
            variant={
              incomes.state.activeData === "PAID" ? "default" : "outline"
            }
            onClick={() => incomes.handler.changeActiveData("PAID")}
          >
            Telah di Setor
          </Button>
        </div>

        {incomesData[incomes.state.activeData].length > 0 ? (
          <>
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
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomesData[incomes.state.activeData].map((income, idx) => (
                  <TableRow key={income.income_id}>
                    <TableCell>{idx + 1}.</TableCell>
                    <TableCell>{income.seller.account.user_name}</TableCell>
                    <TableCell>
                      {income.order.order_item.length} Produk
                    </TableCell>
                    <TableCell>
                      {rupiahConverter(income.total_income)}
                    </TableCell>
                    <TableCell>
                      {rupiahConverter(
                        getIncomesDetail(income).productDevelopment
                      )}
                    </TableCell>
                    <TableCell>
                      {rupiahConverter(getIncomesDetail(income).studentSavings)}
                    </TableCell>
                    <TableCell>
                      {rupiahConverter(getIncomesDetail(income).sellerIncome)}
                    </TableCell>
                    <TableCell>
                      {income.income_status === "PENDING" ? (
                        <PayIncomeButton income_id={income.income_id} />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                <TableCell className="bg-primary text-white font-bold" />
                <TableCell className="bg-primary text-white font-bold">
                  Total
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {incomesData[incomes.state.activeData].flatMap((income) =>
                    income.order.order_item.reduce(
                      (a, b) => a + b.order_quantity,
                      0
                    )
                  )}{" "}
                  Produk
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {rupiahConverter(
                    incomesData[incomes.state.activeData].reduce(
                      (a, b) => a + b.total_income,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {rupiahConverter(
                    incomesData[incomes.state.activeData].reduce(
                      (a, b) => a + b.total_income * 0.5,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {rupiahConverter(
                    incomesData[incomes.state.activeData].reduce(
                      (a, b) => a + b.total_income * 0.2,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {rupiahConverter(
                    incomesData[incomes.state.activeData].reduce(
                      (a, b) => a + b.total_income * 0.3,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="bg-primary text-white font-bold">
                  {incomes.data.some(
                    (income) => income.income_status === "PENDING"
                  ) ? (
                    <Button variant="ghost" className="w-full">
                      Setor semua
                    </Button>
                  ) : null}
                </TableCell>
              </TableBody>
            </Table>

            <Separator />
            <AdminReportIncomesPDF
              incomes={incomesData[incomes.state.activeData]}
              period={{
                month: `${periodMonths.start} sampai dengan ${periodMonths.end}`,
                year: periodYears(),
              }}
              adminName={adminName}
            />
          </>
        ) : (
          <p className="text-center text-sm text-neutral-500">
            Data pendapatan penjual tidak ditemukan
          </p>
        )}
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
