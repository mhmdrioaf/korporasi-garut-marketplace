import NoAccess from "@/components/ui/no-access";
import UsersList from "@/components/ui/user-list";
import authOptions from "@/lib/authOptions";
import { TUser } from "@/lib/globals";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Kelola Pengguna | SMKs Korporasi Garut",
};

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

export default async function UserManagementPageUsers() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NoAccess />;
  } else {
    const usersData = await listAllUser(session.user.token);
    const users = usersData
      ? usersData.filter(
          (user) =>
            user.username !== session.user.username && user.role === "CUSTOMER"
        )
      : null;
    if (!users) {
      return <NoAccess />;
    } else {
      return <UsersList users={users} />;
    }
  }
}
