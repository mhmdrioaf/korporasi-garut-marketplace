import { getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import {
  BoxesIcon,
  DollarSignIcon,
  MapPinIcon,
  ShoppingBagIcon,
  User2Icon,
} from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dashboard | SMKS Korporasi Garut",
  description: "Dashboard pengguna SMKS Korporasi Garut",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  const user = session ? await getUserDetail(session.user.id) : null;
  return (
    <div className="w-full flex flex-col lg:flex-row items-start">
      <div className="w-full bg-background z-40 lg:w-fit h-fit lg:h-screen fixed bottom-0 lg:top-[5.25rem] left-0 border-t border-r-0 border-t-input lg:border-t-0 lg:border-r lg:border-r-input flex flex-row lg:flex-col gap-2 divide-x divide-y-0 lg:divide-y lg:divide-x-0 justify-stretch lg:justify-normal">
        <Link
          className="w-full lg:w-fit grid place-items-center p-2"
          href={ROUTES.USER.DASHBOARD}
          title="Detail Profil"
        >
          <User2Icon className="w-6 h-6" />
          <p className="font-bold text-sm lg:hidden">Akun</p>
        </Link>

        {session?.user.role === "CUSTOMER" && user && user.refferer && (
          <Link
            className="w-full lg:w-fit grid place-items-center p-2"
            href={ROUTES.USER.REFERRAL_INCOMES}
            title="Penghasilan"
          >
            <DollarSignIcon className="w-6 h-6" />
            <p className="font-bold text-sm lg:hidden">Penghasilan</p>
          </Link>
        )}

        {(session?.user.role === "CUSTOMER" ||
          session?.user.role === "SELLER") && (
          <>
            <Link
              className="w-full lg:w-fit grid place-items-center p-2"
              href={
                session?.user.role === "SELLER"
                  ? ROUTES.USER.ORDERS_MANAGEMENT
                  : ROUTES.USER.ORDERS
              }
              title="Pesanan"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              <p className="font-bold text-sm lg:hidden">Pesanan</p>
            </Link>

            <Link
              className="w-full lg:w-fit grid place-items-center p-2"
              href={ROUTES.USER.ADDRESSES}
              title="Alamat"
            >
              <MapPinIcon className="w-6 h-6" />
              <p className="font-bold text-sm lg:hidden">Alamat</p>
            </Link>
          </>
        )}

        {session && session.user.role === "SELLER" && (
          <Link
            className="w-full lg:w-fit grid place-items-center p-2"
            href={ROUTES.USER.PRODUCTS_LIST}
            title="List Produk"
          >
            <BoxesIcon className="w-6 h-6" />
            <p className="font-bold text-sm lg:hidden">Produk</p>
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}
