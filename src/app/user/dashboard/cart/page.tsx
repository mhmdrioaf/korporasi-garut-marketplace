import { Container } from "@/components/ui/container";
import UserCartList from "@/components/ui/user-cart-list";
import authOptions from "@/lib/authOptions";
import { CartProvider } from "@/lib/hooks/context/useCart";
import { getServerSession } from "next-auth";

export default async function UserCart() {
  const session = await getServerSession(authOptions);

  return (
    <Container variant="column">
      {session && (
        <CartProvider user_id={session.user.id}>
          <UserCartList />
        </CartProvider>
      )}
      {!session && (
        <div className="w-full text-center">
          Anda harus login untuk melihat halaman ini.
        </div>
      )}
    </Container>
  );
}
