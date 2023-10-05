import { Container } from "@/components/ui/container";
import ProductAddForm from "@/components/ui/product-add-form";
import authOptions from "@/lib/authOptions";
import { ProductProvider } from "@/lib/hooks/context/useProductContext";
import { getServerSession } from "next-auth";

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="w-full h-screen grid place-items-center">
        Anda tidak mempunyai akses untuk halaman ini.
      </div>
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
