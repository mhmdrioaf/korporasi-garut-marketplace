import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

const AddAddressModal = dynamic(
  () => import("@/components/ui/modals/user-add-address")
);

export default async function AuthLoginModal() {
  const session = await getServerSession(authOptions);
  return !session ? null : <AddAddressModal userId={session.user.id} />;
}
