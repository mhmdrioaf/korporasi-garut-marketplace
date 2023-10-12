import AdminDashboardComponent from "@/components/ui/admin-dashboard";
import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { TProduct, TUser } from "@/lib/globals";
import { getServerSession } from "next-auth";

async function listAllUser(token: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_LIST_ALL_USERS!, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  });

  const response = await res.json();
  return response.result as TUser[] | null;
}

async function listAllProducts() {
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

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else {
    const listUser = listAllUser(session.user.token);
    const listProducts = listAllProducts();
    const [usersData, productsData] = await Promise.all([
      listUser,
      listProducts,
    ]);

    const users = usersData
      ? usersData.filter((user) => user.username !== session.user.username)
      : null;
    if (!users) {
      return <NoAccess />;
    } else {
      return <AdminDashboardComponent users={users} products={productsData} />;
    }
  }
}
