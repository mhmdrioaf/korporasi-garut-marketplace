import AuthRegister from "@/components/ui/auth/register";
import { Container } from "@/components/ui/container";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect(ROUTES.USER.DASHBOARD);
  else
    return (
      <Container className="min-h-[85vh] flex flex-col gap-8">
        <div className="flex flex-col gap-4 px-4 py-2 border border-input rounded-md overflow-hidden">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold text-primary">Daftar</p>
            <p className="text-sm">
              Silahkan daftar untuk dapat segera menggunakan layanan kami.
            </p>
          </div>
          <AuthRegister />
        </div>
      </Container>
    );
}
