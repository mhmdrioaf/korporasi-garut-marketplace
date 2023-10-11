import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { TUser } from "@/lib/globals";
import { getServerSession } from "next-auth";

async function listAllUser(token: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_LIST_ALL_USERS!, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  });

  const response = await res.json();
  return response.result as TUser[] | null;
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else {
    const users = await listAllUser(session.user.token);
    if (!users) {
      return <NoAccess />;
    } else {
      return <p>Hello</p>;
    }
  }
}
