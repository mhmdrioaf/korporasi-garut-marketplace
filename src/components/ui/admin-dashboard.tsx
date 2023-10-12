"use client";

import { TProduct, TUser } from "@/lib/globals";
import { Container } from "./container";
import AdminDashboardMenu from "./admin-dashboard-menu";
import { ROUTES } from "@/lib/constants";
import productsMenuBackground from "../../../public/products-menu-background.jpg";
import usersMenuBackground from "../../../public/users-menu-background.jpg";
import AdminDashboardCard from "./admin-dashboard-card";
import {
  Contact2Icon,
  Package2Icon,
  PackageCheckIcon,
  PackageIcon,
  PackageXIcon,
  Users2Icon,
} from "lucide-react";
import { Separator } from "./separator";

interface IAdminDashboardComponentProps {
  users: TUser[];
  products: TProduct[];
}

export default function AdminDashboardComponent({
  users,
  products,
}: IAdminDashboardComponentProps) {
  const adminCardIconsStyle = "w-10 h-10";
  return (
    <Container variant="column">
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Admin Dashboard</p>
        <p className="text-sm">
          Pada halaman ini, admin dapat mengelola produk yang di unggah oleh
          penjual, serta mengelola akun yang terdaftar pada platform SMKs
          Korporasi Garut Marketplace
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold text-primary text-xl">Menu Utama</p>
        <div className="w-full grid grid-cols-2 gap-4">
          <AdminDashboardMenu
            link={ROUTES.ADMIN.PRODUCT_MANAGEMENT.MAIN}
            background={productsMenuBackground}
            title="Pengelola Produk"
          />
          <AdminDashboardMenu
            link={ROUTES.ADMIN.USER_MANAGEMENT.MAIN}
            background={usersMenuBackground}
            title="Pengelola Pengguna"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold text-primary text-xl">Data Platform</p>
        <div className="w-full grid grid-cols-2 gap-4">
          <AdminDashboardCard
            className="border border-input"
            description={`${users.length} Pengguna`}
            title={`Total\nPengguna Terdaftar`}
            icon={<Users2Icon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.USER_MANAGEMENT.MAIN}
          />
          <AdminDashboardCard
            className="border border-input"
            description={`${
              users.filter((user) => user.role === "SELLER").length
            } Penjual`}
            title={`Total\nPenjual Terdaftar`}
            icon={<Contact2Icon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.USER_MANAGEMENT.SELLERS}
          />
        </div>
        <Separator />
        <div className="w-full grid grid-cols-2 gap-4">
          <AdminDashboardCard
            className="border border-input"
            description={`${products.length} Produk`}
            title={`Total\nProduk di Unggah`}
            icon={<Package2Icon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.PRODUCT_MANAGEMENT.MAIN}
          />
          <AdminDashboardCard
            className="border border-input"
            description={`${
              products.filter((product) => product.status === "PENDING").length
            } Produk`}
            title={`Total\nProduk Menunggu Persetujuan`}
            icon={<PackageIcon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.PRODUCT_MANAGEMENT.PENDING}
          />
          <AdminDashboardCard
            className="bg-green-950 text-primary-foreground"
            description={`${
              products.filter((product) => product.status === "APPROVED").length
            } Produk`}
            title={`Total\nProduk Disetujui`}
            icon={<PackageCheckIcon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.PRODUCT_MANAGEMENT.APPROVED}
          />
          <AdminDashboardCard
            className="bg-destructive text-destructive-foreground"
            description={`${
              products.filter((product) => product.status === "REJECTED").length
            } Produk`}
            title={`Total\nProduk Ditolak`}
            icon={<PackageXIcon className={adminCardIconsStyle} />}
            link={ROUTES.ADMIN.PRODUCT_MANAGEMENT.REJECTED}
          />
        </div>
      </div>
    </Container>
  );
}
