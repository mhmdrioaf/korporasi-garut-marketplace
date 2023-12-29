"use client";

import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { getMonthString, getSales, getTotalProducts } from "@/lib/helper";
import { useEffect } from "react";

export default function AdminReportsComponents() {
  const { reports } = useAdmin();

  const startDate = reports.sales.startDate
    ? new Date(reports.sales.startDate).getMonth()
    : 0;
  const endDate = reports.sales.endDate
    ? new Date(reports.sales.endDate).getMonth()
    : 11;

  useEffect(() => {
    ChartJS.register(...registerables);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      {reports.sales.data && (
        <Chart
          type="line"
          data={{
            labels: getMonthString(startDate, endDate),
            datasets: [
              {
                data: getSales(reports.sales.data, startDate, endDate),
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
      )}

      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="font-bold">
            Total Penjualan: {reports.sales.data?.length ?? 0}
          </p>
          {reports.sales.data && (
            <p className="font-bold">
              Total produk terjual:{" "}
              {getTotalProducts(reports.sales.data, startDate, endDate)} produk
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
