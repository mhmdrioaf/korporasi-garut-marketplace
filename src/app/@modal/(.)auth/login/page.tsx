import LoginModal from "@/components/ui/modals/user-login";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function AuthLoginModal() {
  const session = await getServerSession(authOptions);
  return session ? null : <LoginModal />;
}
