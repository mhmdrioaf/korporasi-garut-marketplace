"use client";

import { TUser } from "@/lib/globals";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { userRoleConverter } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { BanIcon, TrashIcon } from "lucide-react";
import UserDeleteModal from "./modals/user-delete";
import { useState } from "react";

interface IUserListComponentProps {
  users: TUser[];
}

export default function UsersList({ users }: IUserListComponentProps) {
  const [isUserDelete, setIsUserDelete] = useState<boolean>(false);
  const [usernameToDelete, setUsernameToDelete] = useState<string | null>(null);

  const onUserDeleteModalCloses = () => {
    setIsUserDelete(false);
    setUsernameToDelete(null);
  };

  const onUserDelete = (username: string) => {
    setIsUserDelete(true);
    setUsernameToDelete(username);
  };

  return (
    <>
      <UserDeleteModal
        isOpen={isUserDelete}
        onClose={onUserDeleteModalCloses}
        username={usernameToDelete ?? ""}
        executor="admin"
      />
      <Table>
        <TableCaption>
          {users.length > 0
            ? "Daftar pengguna terdaftar di SMKs Korporasi Garut Marketplace."
            : "Saat ini belum ada pengguna terdaftar di SMKs Korporasi Garut Marketplace."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Jenis Akun</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor Telepon</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_id}</TableCell>
              <TableCell>{user.account.user_name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{userRoleConverter(user.role)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number ?? "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="default">
                      Aksi
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                      onClick={() => onUserDelete(user.username)}
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      <span>Hapus Akun</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-secondary hover:text-secondary-foreground cursor-pointer">
                      <BanIcon className="w-4 h-4 mr-2" />
                      <span>Nonaktifkan Akun</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
