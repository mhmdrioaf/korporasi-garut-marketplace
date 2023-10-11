"use client";

import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserManagementNav() {
  const pathname = usePathname();
  const linkStyle =
    "w-[calc(33.333%-0.5rem)] rounded-md px-4 py-2 grid place-items-center self-stretch shrink-0 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer";
  const activeLinkStyle = linkStyle + " bg-primary text-primary-foreground";

  const routes = [
    {
      link: ROUTES.ADMIN.USER_MANAGEMENT.MAIN,
      title: "Semua",
    },
    {
      link: ROUTES.ADMIN.USER_MANAGEMENT.USERS,
      title: "Pelanggan",
    },
    {
      link: ROUTES.ADMIN.USER_MANAGEMENT.SELLERS,
      title: "Penjual",
    },
  ];

  return (
    <div className="w-full flex flex-row items-center justify-between">
      {routes.map((route) => (
        <Link
          key={route.link}
          href={route.link}
          className={
            pathname === route.link
              ? activeLinkStyle
              : linkStyle + " border border-input"
          }
        >
          {route.title}
        </Link>
      ))}
    </div>
  );
}
