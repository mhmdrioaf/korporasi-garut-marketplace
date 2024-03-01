import { Container } from "@/components/ui/container";
import ReferrerAddForm from "@/components/ui/referrer-add-form";

export default function ReferrerAddPage() {
  return (
    <Container className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="font-bold text-primary text-2xl">Tambah Referrer</p>
        <p className="text-xs">
          Tambahkan NISN/NIS/NIP sebagai referral yang terdaftar.
        </p>
      </div>

      <ReferrerAddForm />
    </Container>
  );
}
