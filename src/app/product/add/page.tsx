import { Container } from "@/components/ui/container";
import ProductAddForm from "@/components/ui/product-input";
import authOptions from "@/lib/authOptions";
import { ProductProvider } from "@/lib/hooks/context/useProduct";
import { getServerSession } from "next-auth";

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
    return (
      <ProductProvider session={session}>
        <Container>
          <ProductAddForm />
        </Container>
      </ProductProvider>
    );
  }
}
