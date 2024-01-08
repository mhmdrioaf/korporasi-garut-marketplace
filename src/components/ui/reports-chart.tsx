"use client";

import { getMonthString, getSales, getTotalProducts } from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";

import { Chart } from "react-chartjs-2";

export default function ReportsChart() {
  const { reports } = useAdmin();

  const startDate = reports.sales.startDate
    ? new Date(reports.sales.startDate).getMonth()
    : 0;
  const endDate = reports.sales.endDate
    ? new Date(reports.sales.endDate).getMonth()
    : 11;

  return (
    <>
      <Chart
        type="line"
        data={{
          labels: getMonthString(startDate, endDate),
          datasets: [
            {
              data: reports.sales.data
                ? getSales(reports.sales.data, startDate, endDate)
                : [],
              borderWidth: 1,
              label: "Penjualan",
            },
          ],
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
    </>
  );
}
