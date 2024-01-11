import { Container } from "@/components/ui/container";
import NoAccess from "@/components/ui/no-access";
import SellerOrderList from "@/components/ui/seller-orders-list";
import authOptions from "@/lib/authOptions";
import { TSellerOrder } from "@/lib/globals";
import { permissionHelper } from "@/lib/helper";
import { OrderManagementContextProvider } from "@/lib/hooks/context/useOrderManagement";
import { getServerSession } from "next-auth";

async function getSellerOrders(seller_id: string, seller_token: string) {
  let loading = true;
  const res = await fetch(process.env.NEXT_PUBLIC_API_ORDER_SELLER_ORDERS!, {
    method: "GET",
    headers: {
      token: seller_token,
      id: seller_id,
      "Content-Type": "application/json",
    },
    next: {
      tags: ["seller-orders"],
    },
    cache: "no-store",
  });

  const response = await res.json();

  if (!response.ok) {
    loading = false;
    return {
      loading: loading,
      data: [] as TSellerOrder[],
    };
  } else {
    loading = false;
    return {
      loading: loading,
      data: response.result as TSellerOrder[],
    };
  }
}

export default async function SellerOrder() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else if (
    !permissionHelper(session.user.token, process.env.NEXT_PUBLIC_SELLER_TOKEN!)
  ) {
    return <NoAccess />;
  } else {
    const ordersData = await getSellerOrders(
      session.user.id,
      session.user.token
    );
    if (ordersData.loading) {
      return (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full text-transparent text-center flex flex-row items-center justify-between gap-2 overflow-x-auto">
            <div className="rounded-md px-2 py-4">Semua</div>
            <div className="rounded-md px-2 py-4">Menunggu Pembayaran</div>
            <div className="rounded-md px-2 py-4">Menunggu Pengiriman</div>
            <div className="rounded-md px-2 py-4">Dikemas</div>
            <div className="rounded-md px-2 py-4">Sedang Dikirim</div>
            <div className="rounded-md px-2 py-4">Selesai</div>
          </div>

          <div className="w-full flex flex-col gap-4 text-sm">
            <div className="w-full rounded-md bg-input animate-pulse h-96" />
          </div>
        </div>
      );
    } else {
      return (
        <Container variant="column">
          <div className="flex flex-col gap-2">
            <p className="text-2xl text-primary font-bold">
              Daftar pesanan datang
            </p>
            <p className="text-sm">
              Berikut merupakan daftar pesanan yang datang untuk produk yang
              telah anda unggah.
            </p>
          </div>
          <OrderManagementContextProvider
            orders_data={ordersData.data}
            seller={{ id: session.user.id, token: session.user.token }}
          >
            <SellerOrderList />
          </OrderManagementContextProvider>
        </Container>
      );
    }
  }
}
