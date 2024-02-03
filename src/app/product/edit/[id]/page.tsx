import { Container } from "@/components/ui/container";
import ProductAddForm from "@/components/ui/product-input";
import { getProductDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { ProductProvider } from "@/lib/hooks/context/useProduct";
import { getServerSession } from "next-auth";

export default async function ProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  const productData = getProductDetail(params.id);
  const sessionData = getServerSession(authOptions);

  const [product, session] = await Promise.all([productData, sessionData]);

  if (!session) {
    return (
      <div className="w-full grid place-items-center">
        Anda tidak mempunyai akses untuk halaman ini.
      </div>
    );
  } else if (!product) {
    return (
      <div className="w-full grid place-items-center">
        Data produk tidak ditemukan.
      </div>
    );
  } else if (product.seller.user_id !== parseInt(session.user.id)) {
    return (
      <div className="w-full grid place-items-center">
        Anda tidak mempunyai akses untuk halaman ini.
      </div>
    );
  } else {
    return (
      <ProductProvider session={session} product={product}>
        <Container>
          <ProductAddForm />
        </Container>
      </ProductProvider>
    );
  }
}
