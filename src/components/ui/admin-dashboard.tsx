"use client";

import { TUser } from "@/lib/globals";
import { Container } from "./container";
import UsersList from "./user-list";

interface IAdminDashboardComponentProps {
  users: TUser[];
}

export default function AdminDashboardComponent({
  users,
}: IAdminDashboardComponentProps) {
  return (
    <Container variant="column">
      <p>Jumlah pengguna terdaftar: {users.length} akun.</p>
      <UsersList users={users} />
    </Container>
  );
}
