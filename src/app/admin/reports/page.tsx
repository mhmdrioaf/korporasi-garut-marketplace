import AdminReportsComponents from "@/components/ui/admin-reports";
import { Container } from "@/components/ui/container";
import authOptions from "@/lib/authOptions";
import { AdminProvider } from "@/lib/hooks/context/useAdmin";
import { getServerSession } from "next-auth";

export default async function AdminSalesReportPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <AdminProvider token={session.user.token}>
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
