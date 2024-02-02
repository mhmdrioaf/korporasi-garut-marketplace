import Loading from "@/app/loading";
import { Container } from "@/components/ui/container";
import { getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense, lazy } from "react";

const UserDashboard = lazy(() => import("@/components/ui/dashboard"));

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(ROUTES.AUTH.LOGIN);

  const user = await getUserDetail(session.user.id);
  return user ? (
    <Container>
      <Suspense fallback={<Loading />}>
        <UserDashboard user={user} />
      </Suspense>
    </Container>
  ) : (
    <Loading />
  );
}
