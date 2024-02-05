import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ProductAddForm from "@/components/ui/product-input";
import { getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { ProductProvider } from "@/lib/hooks/context/useProduct";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    session.user.token === process.env.NEXT_PUBLIC_CUSTOMER_TOKEN ||
    session.user.role === "CUSTOMER"
  ) {
    return (
      <div className="w-full h-screen grid place-items-center">
        Anda tidak mempunyai akses untuk halaman ini.
      </div>
    );
  } else {
    const sellerDetail = await getUserDetail(session.user.id);
    if (!sellerDetail) {
      return (
        <div className="w-full h-screen grid place-items-center">
          Anda tidak mempunyai akses untuk halaman ini.
        </div>
      );
    } else if (!sellerDetail.primary_address_id) {
      return (
        <Container className="flex justify-center items-center h-[calc(100vh-7rem)] lg:h-[calc(100vh-14rem)]">
          <div className="w-full bg-blue-100 text-stone-950 lg:w-1/2 xl:w-1/3 rounded-md border border-input overflow-hidden px-4 py-2 flex flex-col gap-2 items-center justify-center self-center justify-self-center">
            <div className="w-full flex flex-col gap-1">
              <p className="text-base lg:text-2xl font-bold">
                Alamat belum diatur
              </p>
              <p className="text-xs lg:text-sm">
                Untuk dapat menambahkan produk, anda harus mengatur data alamat
                utama terlebih dahulu. <br />
                <br /> Alamat utama digunakan untuk mengetahui lokasi penjual
                dan lokasi pengiriman produk. <br /> <br /> Maka dari itu,
                alamat utama merupakan <b>data yang sangat diperlukan</b> untuk
                dapat memulai melakukan penjualan.
              </p>
            </div>
            <Button
              variant="default"
              asChild
              className="w-full text-xs lg:text-sm"
            >
              <Link href={ROUTES.USER.ADDRESSES}>Atur Alamat</Link>
            </Button>
          </div>
        </Container>
      );
    } else {
      return (
        <ProductProvider session={session}>
          <Container>
            <ProductAddForm />
          </Container>
        </ProductProvider>
      );
    }
  }
}
