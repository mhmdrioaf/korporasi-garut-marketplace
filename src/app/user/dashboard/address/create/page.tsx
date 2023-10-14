import { Container } from "@/components/ui/container";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const AddAddressForm = dynamic(() => import("@/components/ui/address-form"));

export default async function AddAddressPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.AUTH.LOGIN);
  else
    return (
      <Container variant="column">
        <AddAddressForm userId={session.user.id} />
      </Container>
    );
}
