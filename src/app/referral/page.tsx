import { Container } from "@/components/ui/container";
import ReferralGenerator from "@/components/ui/referral/referral-generator";
import { listProducts } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ReferralPage() {
  const productsData = listProducts();
  const sessionData = getServerSession(authOptions);

  const [products, session] = await Promise.all([productsData, sessionData]);

  return products ? (
    <div className="w-full h-screen relative">
      <div className="w-2/3 flex flex-col gap-4 px-4 py-2 rounded-md border border-input absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-[30%]">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">
            Pembuatan Tautan Referral
          </p>
          <p className="text-sm">
            Silakan isi form berikut untuk membuat tautan referral
          </p>
        </div>
        {session && (
          <ReferralGenerator
            products={products}
            user_id={Number(session.user.id)}
          />
        )}
      </div>
    </div>
  ) : (
    <Container>
      <p>Maaf, terjadi kesalahan saat memuat data produk</p>
    </Container>
  );
}
