import { Container } from "@/components/ui/container";
import NoAccess from "@/components/ui/no-access";
import SellerOrderList from "@/components/ui/seller-orders-list";
import authOptions from "@/lib/authOptions";
import { permissionHelper } from "@/lib/helper";
import { getServerSession } from "next-auth";

export default async function SellerOrder() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else if (
    !permissionHelper(session.user.token, process.env.NEXT_PUBLIC_SELLER_TOKEN!)
  ) {
    return <NoAccess />;
  } else {
    return (
      <Container variant="column">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">
            Daftar pesanan datang
          </p>
          <p className="text-sm">
            Berikut merupakan daftar pesanan yang datang untuk produk yang telah
            anda unggah.
          </p>
        </div>
        <SellerOrderList
          seller_id={session.user.id}
          seller_token={session.user.token}
        />
      </Container>
    );
  }
}
