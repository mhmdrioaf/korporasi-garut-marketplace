"use client";

import {
  getMonthString,
  getSales,
  getSalesYears,
  getTotalProducts,
} from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { color } from "@/lib/utils";

import { Chart } from "react-chartjs-2";
import ReportsDatePicker from "./reports-date-picker";

export default function ReportsChart() {
  const { reports } = useAdmin();

  const startDate = reports.sales.date?.from?.getMonth() ?? 0;
  const endDate = reports.sales.date?.to?.getMonth() ?? 11;

  return (
    <>
      <Chart
        id="report-chart"
        type="bar"
        data={{
          labels: getMonthString(startDate, endDate === 11 ? 12 : endDate + 1),
          datasets: getSalesYears(reports.sales.data ?? []).map(
            (year, index) => ({
              data: getSales(reports.sales.data ?? [], startDate, endDate)[
                year
              ],
              label: year,
              backgroundColor: color(index),
              borderColor: color(index),
            })
          ),
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              ticks: {
                precision: 0,
              },
            },
          },
        }}
      />

      <div className="w-full flex flex-row items-center gap-2 justify-between">
        {reports.sales.data && (
          <div className="w-full flex flex-col gap-2 text-sm">
            <div className="w-fit flex flex-row items-center gap-4 justify-between">
              <p className="font-bold">
                Total Penjualan: {reports.sales.data.length}
              </p>
              <p className="font-bold">
                Total produk terjual:{" "}
                {getTotalProducts(reports.sales.data, startDate, endDate)}{" "}
                produk
              </p>
            </div>
          </div>
        )}

        <div className="w-full self-end">
          <ReportsDatePicker />
        </div>
      </div>
    </>
  );
}
