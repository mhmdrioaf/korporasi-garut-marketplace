"use client";

import AdminProductsIdentifications from "@/components/ui/admin-products-identifications";
import AdminReportIncomes from "@/components/ui/admin-report-incomes";
import PreorderReport from "@/components/ui/admin-report-preorder";
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
    case "preorder":
      return <PreorderReport />;
    default:
      <ReportsProducts />;
  }
}
