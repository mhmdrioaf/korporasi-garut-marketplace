import AuthRegister from "@/components/ui/auth/register";
import { Container } from "@/components/ui/container";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/user/dashboard");
  else
    return (
      <Container className="min-h-[85vh] flex flex-col gap-8">
        <div className="w-full flex items-start justify-start">
          <div className="w-full flex flex-col gap-2">
            <p className="text-xl lg:text-4xl">Daftar</p>
            <p className="text-sm lg:text-base">
              Segera daftar untuk dapat menggunakan layanan kami.
            </p>
          </div>
        </div>
        <AuthRegister />
      </Container>
    );
}
