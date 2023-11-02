import NoAccess from "@/components/ui/no-access";
import SellerOrderList from "@/components/ui/seller-orders-list";
import authOptions from "@/lib/authOptions";
import { TSellerOrder } from "@/lib/globals";
import { getServerSession } from "next-auth";

async function getSellerOrders() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  } else if (session.user.role !== "SELLER") {
    return null;
  } else {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ORDER_SELLER_ORDERS!, {
      method: "POST",
      headers: {
        token: session.user.token.toString(),
      },
      body: JSON.stringify({
        seller_id: session.user.id,
      }),
    });

    const response = await res.json();

    if (!response.ok) {
      return null;
    } else {
      return {
        result: response.result as TSellerOrder[],
        seller_token: session.user.token,
      };
    }
  }
}

export default async function SellerOrder() {
  const sellerOrders = await getSellerOrders();

  if (!sellerOrders) {
    return <NoAccess />;
  } else {
    return (
      <SellerOrderList
        orders={sellerOrders.result}
        seller_token={sellerOrders.seller_token}
      />
    );
  }
}
