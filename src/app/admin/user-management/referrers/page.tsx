import NotFound from "@/app/not-found";
import ReferrerLists from "@/components/ui/referrer-list";
import { listReferrer } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ReferrersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NotFound />;
  }

  if (session.user.role !== "ADMIN") {
    return <NotFound />;
  }

  const referrers = await listReferrer(session.user.token);

  if (!referrers) {
    return <NotFound />;
  }

  return <ReferrerLists referrers={referrers} />;
}
