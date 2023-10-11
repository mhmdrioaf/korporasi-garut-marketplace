import ProductManagementNav from "@/components/ui/admin-product-management-nav";
import { Container } from "@/components/ui/container";
import NoAccess from "@/components/ui/no-access";
import authOptions from "@/lib/authOptions";
import { permissionHelper } from "@/lib/helper";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Pengelola Produk | SMKs Korporasi Garut",
};

export default async function ProductManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAllowed =
    session &&
    permissionHelper(session.user.role, "ADMIN") &&
    permissionHelper(session.user.token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!);
  return isAllowed ? (
    <Container variant="column">
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Daftar Produk</p>
        <p className="text-sm">
          Berikut merupakan daftar produk yang telah di unggah oleh penjual di
          SMKs Korporasi Garut
        </p>
      </div>
      <ProductManagementNav />
      {children}
    </Container>
  ) : (
    <NoAccess />
  );
}
