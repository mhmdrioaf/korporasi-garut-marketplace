import NoAccess from "@/components/ui/no-access";
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else {
    return (
      <AdminProvider
        isAllowed={
          permissionHelper(
            session.user.token,
            process.env.NEXT_PUBLIC_ADMIN_TOKEN!
          ) && permissionHelper(session.user.role, "ADMIN")
        }
      >
        {children}
      </AdminProvider>
    );
  }
}
