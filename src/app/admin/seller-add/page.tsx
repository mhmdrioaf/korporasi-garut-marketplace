import SellerRegister from "@/components/ui/auth/register-seller";
import { Container } from "@/components/ui/container";
import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { permissionHelper } from "@/lib/helper";
import { getServerSession } from "next-auth";

export default async function SellerRegisterPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !permissionHelper(session.user.token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)
  ) {
    return <NoAccess />;
  } else {
    return (
      <Container variant="column">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">Tambahkan Penjual</p>
          <p className="text-sm">
            Harap isi data penjual dengan tepat untuk menghindari kesalahan
            transaksi.
          </p>
        </div>
        <SellerRegister token={session.user.token} />
      </Container>
    );
  }
}
