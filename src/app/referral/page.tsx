import { Container } from "@/components/ui/container";
import ReferralGenerator from "@/components/ui/referral/referral-generator";
import { listProducts } from "@/lib/api";

export default async function ReferralPage() {
  const products = await listProducts();

  return products ? (
    <Container variant="column">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">
          Pembuatan Tautan Referral
        </p>
        <p className="text-sm">
          Silakan isi form berikut untuk membuat tautan referral
        </p>
      </div>

      <ReferralGenerator products={products} />
    </Container>
  ) : (
    <Container>
      <p>Maaf, terjadi kesalahan saat memuat data produk</p>
    </Container>
  );
}
