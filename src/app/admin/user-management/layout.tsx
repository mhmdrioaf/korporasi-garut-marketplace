import UserManagementNav from "@/components/ui/admin-user-management-nav";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

interface IUserManagementLayoutProps {
  children: React.ReactNode;
}

export default function UserManagementLayout({
  children,
}: IUserManagementLayoutProps) {
  return (
    <Container variant="column">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold text-primary">Kelola Pengguna</p>
        <p className="text-sm">
          Pada halaman ini, admin dapat mengelola akun pengguna yang terdaftar
          pada SMKs Korporasi Garut.
        </p>
      </div>
      <UserManagementNav />
      {children}
    </Container>
  );
}
