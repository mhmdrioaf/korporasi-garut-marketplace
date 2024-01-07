"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { Loader2Icon } from "lucide-react";
import { Separator } from "./separator";
import ReportsDatePicker from "./reports-date-picker";
import ReportsChart from "./reports-chart";
import {
  getMonthString,
  getTotalIncome,
  getTotalProducts,
  rupiahConverter,
} from "@/lib/helper";
import { useEffect } from "react";
import ReportsProducts from "./reports-products";

export default function AdminReportsComponents() {
  const { reports } = useAdmin();

  const startDate = reports.sales.startDate
    ? new Date(reports.sales.startDate).getMonth()
    : 0;
  const endDate = reports.sales.endDate
    ? new Date(reports.sales.endDate).getMonth()
    : 11;

  return (
    <div className="w-full flex flex-col gap-4">
      {reports.sales.state.loading ? (
        <div className="w-full h-96 flex flex-col items-center justify-center gap-2">
          <Loader2Icon className="text-primary w-16 h-16 animate-spin" />
          <p className="text-sm">Memuat data...</p>
        </div>
      ) : (
        <ReportsChart />
      )}

      {reports.sales.data && (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="font-bold">
              Total Penjualan: {reports.sales.data.length}
            </p>

            <p className="font-bold">
              Total produk terjual:{" "}
              {getTotalProducts(reports.sales.data, startDate, endDate)} produk
            </p>
          </div>
        </div>
      )}

      <Separator />

      <ReportsDatePicker />

      <Separator />
      <ReportsProducts />

      <Separator />
      <div className="w-full grid grid-cols-2">
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
    </div>
  );
}
