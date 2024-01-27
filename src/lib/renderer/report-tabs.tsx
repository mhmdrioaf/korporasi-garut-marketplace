"use client";

import AdminProductsIdentifications from "@/components/ui/admin-products-identifications";
import AdminReportIncomes from "@/components/ui/admin-report-incomes";
import PreorderReport from "@/components/ui/admin-report-preorder";
import ReportsProducts from "@/components/ui/reports-products";
import { useSession } from "next-auth/react";
import { TAdminReportTabs } from "../hooks/context/adminContextType";

interface IReportTabsProps {
  tab: TAdminReportTabs;
}

export default function ReportTabs({ tab }: IReportTabsProps) {
  const { data: session } = useSession();
  switch (tab) {
    case "sales":
      return (
        <ReportsProducts adminName={session?.user.name ?? "Adminstrator"} />
      );
    case "products":
      return <AdminProductsIdentifications />;
    case "incomes":
      return (
        <AdminReportIncomes adminName={session?.user.name ?? "Adminstrator"} />
      );
    case "preorder":
      return (
        <PreorderReport adminName={session?.user.name ?? "Adminstrator"} />
      );
    default:
      <ReportsProducts adminName={session?.user.name ?? "Adminstrator"} />;
  }
}
