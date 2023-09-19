import { Container } from "@/components/ui/container";
import CustomerOrderList from "@/components/ui/customer-order-list";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { ICustomerOrder } from "@/lib/globals";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getUserOrders(id: string) {
  const fetchOrders = await fetch(
    process.env.NEXT_PUBLIC_API_GET_CUSTOMER_ORDERS! + id,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const ordersResponse = await fetchOrders.json();

  if (!ordersResponse.ok) {
    return [] as ICustomerOrder[];
  } else {
    return ordersResponse.result as ICustomerOrder[];
  }
}

export default async function UserOrders() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(ROUTES.AUTH.LOGIN);

  const userOrders = await getUserOrders(session.user.id);

  if (userOrders.length > 0) {
    return (
      <Container variant="column">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">Pesanan Anda</p>
          <p className="text-sm">
            Berikut adalah data-data pesanan yang telah anda lakukan.
          </p>
        </div>

        <CustomerOrderList orders={userOrders} />
      </Container>
    );
  } else {
    return (
      <Container variant="column">
        <p className="text-sm">
          Anda belum melakukan pesanan apapun,{" "}
          <Link href={ROUTES.LANDING_PAGE} className="font-bold text-primary">
            Klik disini untuk mencari produk.
          </Link>
        </p>
      </Container>
    );
  }
}
