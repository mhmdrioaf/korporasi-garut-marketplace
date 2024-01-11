"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { Loader2Icon } from "lucide-react";
import { Separator } from "./separator";
import ReportsDatePicker from "./reports-date-picker";
import ReportsChart from "./reports-chart";
import { Button } from "./button";
import ReportTabs from "@/lib/renderer/report-tabs";
import AdminReportExportPDF from "./admin-report-export-pdf";
import { getPeriodTime } from "@/lib/helper";

export default function AdminReportsComponents() {
  const { reports } = useAdmin();

  const periodMonths = getPeriodTime(
    parseInt(reports.sales.startDate) - 1,
    parseInt(reports.sales.endDate)
  );

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

      <Separator />

      <ReportsDatePicker />

      <Separator />

      <div className="w-full grid grid-cols-3 gap-2 items-center">
        <Button
          variant={reports.sales.state.tabs === "sales" ? "default" : "ghost"}
          onClick={() => reports.sales.handler.changeTab("sales")}
        >
          Penjualan
        </Button>
        <Button
          variant={
            reports.sales.state.tabs === "products" ? "default" : "ghost"
          }
          onClick={() => reports.sales.handler.changeTab("products")}
        >
          Identifikasi Produk
        </Button>
        <Button
          variant={reports.sales.state.tabs === "incomes" ? "default" : "ghost"}
          onClick={() => reports.sales.handler.changeTab("incomes")}
        >
          Pendapatan
        </Button>
      </div>
      <ReportTabs tab={reports.sales.state.tabs} />
      {reports.sales.data && (
        <AdminReportExportPDF
          reportsData={reports.sales.data}
          period={{
            month: `${periodMonths.start} sampai dengan ${periodMonths.end}`,
            year: parseInt(reports.sales.year),
          }}
        />
      )}
    </div>
  );
}