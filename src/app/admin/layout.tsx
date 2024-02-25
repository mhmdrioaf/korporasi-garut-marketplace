import AdminDashboardWarning from "@/components/ui/admin-dashboard-warning";
import AdminSidePanel from "@/components/ui/admin-side-panel";
import NoAccess from "@/components/ui/no-access";
import { getIncomes } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { permissionHelper } from "@/lib/helper";
import { AdminProvider } from "@/lib/hooks/context/useAdmin";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

interface IAdminDashboardLayoutProps {
  children: ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
  const isAllowed =
    session &&
    permissionHelper(session.user.token, adminToken!) &&
    permissionHelper(session.user.role, "ADMIN");
  const returnValue = {
    title: isAllowed
      ? "Admin Dashboard | SMKs Korporasi Garut"
      : "Forbidden | SMKs Korporasi Garut",
    description: isAllowed
      ? "Halaman admin marketplace smks korporasi garut"
      : "No Access.",
  };

  return returnValue;
}

export default async function AdminDashboardLayout({
  children,
}: IAdminDashboardLayoutProps) {
  const sessionPromise = getServerSession(authOptions);
  const incomesPromise = getIncomes();

  const [session, incomes] = await Promise.all([
    sessionPromise,
    incomesPromise,
  ]);

  if (!session) {
    return <NoAccess />;
  } else {
    return (
      <div className="w-full flex flex-col lg:flex-row items-start relative">
        <AdminSidePanel />

        <AdminProvider token={session.user.token} incomes={incomes}>
          {children}
        </AdminProvider>

        <AdminDashboardWarning />
      </div>
    );
  }
}
