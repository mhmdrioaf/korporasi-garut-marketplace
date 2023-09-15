import Loading from "@/app/loading";
import { Container } from "@/components/ui/container";
import { db } from "@/lib/db";
import { IUser } from "@/lib/globals";
import Users from "@/lib/prisma-classes/User";
import { getServerSession } from "next-auth";
import { Suspense, lazy } from "react";

const UserDashboard = lazy(() => import("@/components/ui/dashboard"));

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session)
    return (
      <div className="w-full h-screen grid place-items-center">
        Anda harus login terlebih dahulu untuk mengakses halaman ini!
      </div>
    );

  const users = new Users(db.user);
  const user: IUser | null = await users.getUserDetail(session.user.username!);

  if (!user)
    return (
      <div className="w-full h-screen grid place-items-center">
        Maaf, user ini tidak tersedia.
      </div>
    );

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <UserDashboard user={user} />
      </Suspense>
    </Container>
  );
}
