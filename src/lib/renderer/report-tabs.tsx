"use client";

import AdminProductsIdentifications from "@/components/ui/admin-products-identifications";
import AdminReportIncomes from "@/components/ui/admin-report-incomes";
import ReportsProducts from "@/components/ui/reports-products";

interface IReportTabsProps {
  tab: TAdminReportTabs;
}

export default function ReportTabs({ tab }: IReportTabsProps) {
  switch (tab) {
    case "sales":
      return <ReportsProducts />;
    case "products":
      return <AdminProductsIdentifications />;
    case "incomes":
      return <AdminReportIncomes />;
    default:
      <ReportsProducts />;
  }
}
