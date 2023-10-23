import RegisterModal from "@/components/ui/modals/user-register";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function AuthLoginModal() {
  const session = await getServerSession(authOptions);
  return session ? null : <RegisterModal />;
}
