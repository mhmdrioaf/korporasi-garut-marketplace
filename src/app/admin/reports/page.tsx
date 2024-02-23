import AdminReportsComponents from "@/components/ui/admin-reports";
import { Container } from "@/components/ui/container";
import { getIncomes } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { AdminProvider } from "@/lib/hooks/context/useAdmin";
import { getServerSession } from "next-auth";

export default async function AdminSalesReportPage() {
  const sessionPromise = getServerSession(authOptions);
  const incomesPromise = getIncomes();

  const [session, incomes] = await Promise.all([
    sessionPromise,
    incomesPromise,
  ]);

  if (session) {
    return (
      <AdminProvider token={session.user.token} incomes={incomes ?? []}>
        <Container variant="column">
          <div className="w-full flex flex-col gap-2">
            <p className="font-bold text-2xl">Laporan Penjualan</p>
            <p className="text-sm">
              Berikut merupakan data laporan penjualan yang telah terjadi pada
              marketplace SMKS Korporasi Garut
            </p>

            <AdminReportsComponents />
          </div>
        </Container>
      </AdminProvider>
    );
  }
}
