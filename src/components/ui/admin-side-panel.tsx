"use client";

import { ROUTES } from "@/lib/constants";
import {
  BarChart3Icon,
  BoxesIcon,
  LayoutDashboardIcon,
  UserPlus2Icon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminSidePanel() {
  const [labelShown, setLabelShown] = useState<boolean>(false);

  const labelStyle = `font-bold text-sm text-center ${
    !labelShown ? "lg:hidden" : ""
  }`;

  function handleShownLabel(shown: boolean) {
    setLabelShown(shown);
  }

  return (
    <div
      onMouseOver={() => handleShownLabel(true)}
      onMouseLeave={() => handleShownLabel(false)}
      className="w-full bg-background z-40 lg:w-fit h-fit lg:h-screen fixed bottom-0 lg:top-[5.25rem] left-0 border-t border-r-0 border-t-input lg:border-t-0 lg:border-r lg:border-r-input flex flex-row lg:flex-col gap-2 divide-x divide-y-0 lg:divide-y lg:divide-x-0 justify-stretch lg:justify-normal"
    >
      <Link
        className="w-full grid place-items-center p-2 lg:flex lg:flex-row lg:gap-2 lg:items-center"
        href={ROUTES.ADMIN.DASHBOARD}
        title="Dashboard"
      >
        <LayoutDashboardIcon className="w-6 h-6" />
        <p className={labelStyle}>Dashboard</p>
      </Link>

      <Link
        className="w-full grid place-items-center p-2 lg:flex lg:flex-row lg:gap-2 lg:items-center"
        href={ROUTES.ADMIN.USER_MANAGEMENT.MAIN}
        title="Kelola Pengguna"
      >
        <Users2Icon className="w-6 h-6" />
        <p className={labelStyle}>Kelola Pengguna</p>
      </Link>

      <Link
        className="w-full grid place-items-center p-2 lg:flex lg:flex-row lg:gap-2 lg:items-center"
        href={ROUTES.ADMIN.USER_MANAGEMENT.ADD_SELLER}
        title="Tambahkan Penjual"
      >
        <UserPlus2Icon className="w-6 h-6" />
        <p className={labelStyle}>Tambahkan Penjual</p>
      </Link>

      <Link
        className="w-full grid place-items-center p-2 lg:flex lg:flex-row lg:gap-2 lg:items-center"
        href={ROUTES.ADMIN.PRODUCT_MANAGEMENT.MAIN}
        title="Kelola Produk"
      >
        <BoxesIcon className="w-6 h-6" />
        <p className={labelStyle}>Kelola Produk</p>
      </Link>

      <Link
        className="w-full grid place-items-center p-2 lg:flex lg:flex-row lg:gap-2 lg:items-center"
        href={ROUTES.ADMIN.REPORTS}
        title="Laporan Penjualan"
      >
        <BarChart3Icon className="w-6 h-6" />
        <p className={labelStyle}>Laporan Penjualan</p>
      </Link>
    </div>
  );
}
