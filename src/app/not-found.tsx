import { Container } from "@/components/ui/container";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
      <p className="font-bold text-primary text-2xl">404</p>
      <p className="text-xs">Halaman yang anda cari tidak ditemukan.</p>
      <Link
        href={ROUTES.LANDING_PAGE}
        className="font-bold text-xs text-primary"
      >
        Klik disini untuk kembali
      </Link>
    </Container>
  );
}
