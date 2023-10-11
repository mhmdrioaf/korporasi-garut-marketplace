import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { permissionHelper } from "@/lib/helper";
import { AdminProvider } from "@/lib/hooks/context/useAdmin";
import { LayoutDashboardIcon, Package2Icon, Users2Icon } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
      <div className="w-full flex flex-col lg:flex-row items-start">
        <div className="w-full bg-background z-40 lg:w-fit h-fit lg:h-screen fixed bottom-0 lg:top-[7.25rem] left-0 border-t border-r-0 border-t-input lg:border-t-0 lg:border-r lg:border-r-input flex flex-row lg:flex-col gap-2 divide-x divide-y-0 lg:divide-y lg:divide-x-0 justify-stretch lg:justify-normal">
          <Link
            className="w-full lg:w-fit grid place-items-center p-2"
            href={ROUTES.ADMIN.DASHBOARD}
            title="Dashboard"
          >
            <LayoutDashboardIcon className="w-6 h-6" />
            <p className="font-bold text-sm lg:hidden">Dashboard</p>
          </Link>

          <Link
            className="w-full lg:w-fit grid place-items-center p-2"
            href={ROUTES.ADMIN.USER_MANAGEMENT.MAIN}
            title="Kelola Pengguna"
          >
            <Users2Icon className="w-6 h-6" />
            <p className="font-bold text-sm lg:hidden">Kelola Pengguna</p>
          </Link>

          <Link
            className="w-full lg:w-fit grid place-items-center p-2"
            href="#"
            title="Kelola Produk"
          >
            <Package2Icon className="w-6 h-6" />
            <p className="font-bold text-sm lg:hidden">Kelola Produk</p>
          </Link>
        </div>

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
      </div>
    );
  }
}
