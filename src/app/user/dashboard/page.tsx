import Loading from "@/app/loading";
import { Container } from "@/components/ui/container";
import authOptions from "@/lib/authOptions";
import { ROUTES } from "@/lib/constants";
import { IUser } from "@/lib/globals";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense, lazy } from "react";

const UserDashboard = lazy(() => import("@/components/ui/dashboard"));

async function getUserDetail(id: string) {
  const fetchUser = await fetch(process.env.NEXT_PUBLIC_API_GET_USER! + id, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const response = await fetchUser.json();
  return response.result as IUser;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(ROUTES.AUTH.LOGIN);

  const user = await getUserDetail(session.user.id);
  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <UserDashboard user={user} />
      </Suspense>
    </Container>
  );
}
