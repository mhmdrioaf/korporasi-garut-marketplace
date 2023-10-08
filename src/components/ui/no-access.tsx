import Link from "next/link";
import { Container } from "./container";
import { ROUTES } from "@/lib/constants";

export default function NoAccess() {
  return (
    <Container>
      <div className="w-full flex flex-col gap-2 justify-center items-center">
        <p className="text-xl">Anda tidak mempunyai akses untuk halaman ini.</p>
        <Link href={ROUTES.LANDING_PAGE} className="font-bold text-primary">
          Kembali ke beranda.
        </Link>
      </div>
    </Container>
  );
}
