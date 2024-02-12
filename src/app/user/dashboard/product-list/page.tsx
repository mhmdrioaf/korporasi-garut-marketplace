import { Container } from "@/components/ui/container";
import DashboardProductList from "@/components/ui/dashboard-product-list";
import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

async function getProducts(id: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_PRODUCT_LIST_SELLER_PRODUCTS! + id,
    {
      method: "GET",
      headers: { "Content-Type": "application.json" },
      cache: "no-store",
    }
  );

  const response = await res.json();
  return response.result as TProduct[];
}

export default async function ProductsListPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <NoAccess />;
  } else {
    if (
      session.user.token === process.env.NEXT_PUBLIC_SELLER_TOKEN ||
      session.user.token === process.env.NEXT_PUBLIC_ADMIN_TOKEN
    ) {
      const products = await getProducts(session.user.id);
      if (products.length > 0) {
        if (products[0].seller.user_id === parseInt(session.user.id)) {
          return (
            <Container>
              <DashboardProductList products={products} />
            </Container>
          );
        } else {
          return <NoAccess />;
        }
      } else {
        return (
          <Container>
            <DashboardProductList products={products} />
          </Container>
        );
      }
    } else {
      return <NoAccess />;
    }
  }
}
