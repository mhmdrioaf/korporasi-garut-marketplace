import UserIncomes from "@/components/ui/user-incomes";
import { getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

async function getUserIncomes() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const user = await getUserDetail(session.user.id);
  if (user) {
    const incomes = user.refferer?.incomes ?? [];
    return incomes;
  } else {
    return [];
  }
}

export default async function ReferralIncomesPage() {
  const incomes = await getUserIncomes();
  return <UserIncomes incomes={incomes} />;
}
