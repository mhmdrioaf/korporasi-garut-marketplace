"use client";

import { ROUTES } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full px-4 py-8 md:px-16 md:py-4 border-t border-t-input flex flex-row gap-2 items-center justify-between">
      <div className="inline-flex gap-2 items-center font-bold text-primary">
        <Image src="/smk_logo.png" alt="Logo smk" width={18} height={18} />
        <span>SMKS Korporasi Garut &copy; 2024</span>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <b>Quick Links</b>

        <Link
          href="/referral"
          className="text-xs text-primary font-medium underline underline-offset-4"
        >
          Menjadi Referral
        </Link>
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-xs text-primary font-medium underline underline-offset-4"
        >
          Login
        </Link>
        <Link
          href={ROUTES.AUTH.REGISTER}
          className="text-xs text-primary font-medium underline underline-offset-4"
        >
          Daftar
        </Link>
      </div>
    </footer>
  );
}
