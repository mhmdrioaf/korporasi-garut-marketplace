"use client";

import { getMonthString, getSales } from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";

import { useEffect } from "react";
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
  );
}
