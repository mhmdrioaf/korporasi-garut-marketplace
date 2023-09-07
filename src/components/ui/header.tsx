"use client";

import Image from "next/image";
import logo from "../../../public/smk_logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";

export default function Header() {
  const pathname = usePathname();

  const activeStyles = "font-bold text-primary";

  return (
    <div className="w-full px-16 lg:px-8 py-2 border-b border-b-stone-300 sticky top-0 left-0 grid grid-cols-3 place-items-center">
      <div className="inline-flex gap-4 justify-self-start">
        <Link className={pathname === "/" ? activeStyles : ""} href="/">
          Marketplace
        </Link>
        <Link className={pathname === "/ee" ? activeStyles : ""} href="#">
          Kategori
        </Link>
        <Link className={pathname === "/rr" ? activeStyles : ""} href="#">
          FAQs
        </Link>
      </div>

      <div className="w-16 h-16 relative">
        <Image src={logo} alt="smk logo" fill className="object-center" />
      </div>

      <div className="inline-flex gap-4 justify-self-end">
        <Button variant="default">Login</Button>
        <div className="w-px min-h-full bg-stone-300" />
        <Button variant="outline">Daftar</Button>
      </div>
    </div>
  );
}
