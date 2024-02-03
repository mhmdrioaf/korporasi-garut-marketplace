import { Container } from "@/components/ui/container";
import UserAddressList from "@/components/ui/user-address";
import { getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { TAddress } from "@/lib/globals";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserAddress() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(ROUTES.AUTH.LOGIN);
  const user = await getUserDetail(session.user.id);

  if (!user) return null;

  return (
    <Container className="flex flex-col gap-4 lg:gap-8">
      <div className="w-full flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-base lg:text-2xl text-primary">Alamat</p>
          <p className="text-xs lg:text-sm">
            Berikut ini adalah data alamat yang digunakkan untuk pengiriman
          </p>
        </div>
        <Link
          href={ROUTES.USER.ADD_ADDRESS}
          className="w-full md:w-fit p-2 text-xs md:text-sm text-center font-bold rounded-md bg-primary text-primary-foreground"
        >
          Tambah Alamat
        </Link>
      </div>
      <UserAddressList
        addresses={user.address}
        primaryAddressId={user.primary_address_id}
        user_id={session.user.id}
      />
    </Container>
  );
}
