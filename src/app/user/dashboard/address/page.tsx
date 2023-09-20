import { Container } from "@/components/ui/container";
import UserAddressList from "@/components/ui/user-address";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { IAddress, IUser } from "@/lib/globals";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getUserAddresses(id: string) {
  const fetchAddress = await fetch(
    process.env.NEXT_PUBLIC_API_GET_USER_ADDRESSES! + id,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const addressResponse = await fetchAddress.json();
  if (!addressResponse.ok) {
    return {
      address: [],
      primary_address_id: null,
    };
  } else {
    return addressResponse.result as {
      address: IAddress[];
      primary_address_id: string | null;
    };
  }
}

export default async function UserAddress() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(ROUTES.AUTH.LOGIN);
  const userAddress = await getUserAddresses(session.user.id);

  return (
    <Container variant="column">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-2xl text-primary">Alamat</p>
          <p className="text-sm">
            Berikut ini adalah data alamat yang digunakkan untuk pengiriman
          </p>
        </div>
        <Link
          href={ROUTES.USER.ADD_ADDRESS}
          className="p-2 text-sm font-bold rounded-md bg-primary text-primary-foreground"
        >
          Tambah Alamat
        </Link>
      </div>
      <UserAddressList
        addresses={userAddress.address}
        primaryAddressId={userAddress.primary_address_id}
      />
    </Container>
  );
}
