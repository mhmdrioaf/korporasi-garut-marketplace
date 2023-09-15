import { Button } from "@/components/ui/button";
import { LayoutDashboardIcon, MapPinIcon, ShoppingBagIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dashboard | SMKS Korporasi Garut",
  description: "Dashboard pengguna SMKS Korporasi Garut",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start">
      <div className="w-full bg-background z-40 lg:w-fit h-fit lg:h-screen fixed bottom-0 lg:top-20 left-0 border-t border-r-0 border-t-input lg:border-t-0 lg:border-r lg:border-r-input flex flex-row lg:flex-col gap-2 divide-x divide-y-0 lg:divide-y lg:divide-x-0 justify-stretch lg:justify-normal">
        <Link
          className="w-full lg:w-fit grid place-items-center p-2"
          href="/user/dashboard"
          title="Detail Profil"
        >
          <LayoutDashboardIcon className="w-6 h-6" />
          <p className="font-bold text-sm lg:hidden">Dashboard</p>
        </Link>

        <Link
          className="w-full lg:w-fit grid place-items-center p-2"
          href="#"
          title="Pesanan"
        >
          <ShoppingBagIcon className="w-6 h-6" />
          <p className="font-bold text-sm lg:hidden">Pesanan</p>
        </Link>

        <Link
          className="w-full lg:w-fit grid place-items-center p-2"
          href="#"
          title="Alamat"
        >
          <MapPinIcon className="w-6 h-6" />
          <p className="font-bold text-sm lg:hidden">Alamat</p>
        </Link>
      </div>

      {children}
    </div>
  );
}
