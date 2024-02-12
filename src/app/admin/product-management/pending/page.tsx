import AdminProductList from "@/components/ui/admin-product-list";
import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { permissionHelper } from "@/lib/helper";
import { getServerSession } from "next-auth";

async function listProducts() {
  const fetchProducts = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_LIST!, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const response = await fetchProducts.json();
  if (!response.ok) {
    return [];
  } else {
    return response.result.products as TProduct[];
  }
}

export default async function AdminProductManagementMainPage() {
  const session = await getServerSession(authOptions);
  const products = await listProducts();

  if (
    !session ||
    (!permissionHelper(session.user.role, "ADMIN") &&
      !permissionHelper(
        session.user.token,
        process.env.NEXT_PUBLIC_ADMIN_TOKEN!
      ))
  ) {
    return <NoAccess />;
  } else {
    return (
      <AdminProductList
        products={products.filter((product) => product.status === "PENDING")}
        token={session.user.token}
      />
    );
  }
}
