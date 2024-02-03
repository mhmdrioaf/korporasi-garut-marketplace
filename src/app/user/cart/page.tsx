import UserCartList from "@/components/ui/user-cart-list";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { getUserCart } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { CartProvider } from "@/lib/hooks/context/useCart";
import { getServerSession } from "next-auth";

export default async function UserCart() {
  const session = await getServerSession(authOptions);

  if (session) {
    const cartData = await getUserCart(parseInt(session.user.id));

    return (
      <Container className="flex flex-col gap-2 md:gap-4">
        <div className="w-full flex flex-col gap-1 md:gap-2">
          <p className="font-bold text-base lg:text-2xl text-primary">
            Keranjang
          </p>
          <p className="text-xs lg:text-sm">
            Berikut merupakan daftar produk yang telah anda tambahkan ke
            keranjang belanjaan anda
          </p>
        </div>

        <Separator />

        {cartData ? (
          <CartProvider user_id={session.user.id} cartData={cartData}>
            <UserCartList />
          </CartProvider>
        ) : (
          <div className="w-full text-center">
            Anda belum menambahkan produk apapun ke keranjang belanjaan anda.
          </div>
        )}
      </Container>
    );
  } else {
    return (
      <Container className="flex flex-col gap-4 lg:gap-8">
        <div className="w-full text-center">
          Anda harus login untuk melihat halaman ini.
        </div>
      </Container>
    );
  }
}
