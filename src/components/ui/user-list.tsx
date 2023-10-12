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
import { BanIcon, CheckIcon, TrashIcon } from "lucide-react";
import UserDeleteModal from "./modals/user-delete";
import { useState } from "react";
import UserDisableModal from "./modals/user-deactivate";

interface IUserListComponentProps {
  users: TUser[];
  token: string;
}

export default function UsersList({ users, token }: IUserListComponentProps) {
  const [isUserDelete, setIsUserDelete] = useState<boolean>(false);
  const [isUserDisable, setIsUserDisable] = useState<boolean>(false);
  const [isUserDeactivate, setIsUserDeactivate] = useState<boolean>(true);

  const [usernameToUpdate, setUsernameToUpdate] = useState<string | null>(null);

  const onModalsCloses = () => {
    setIsUserDelete(false);
    setIsUserDisable(false);
    setUsernameToUpdate(null);
  };

  const onUserDelete = (username: string) => {
    setIsUserDelete(true);
    setUsernameToUpdate(username);
  };

  const onUserDisable = (username: string, option: boolean) => {
    setIsUserDisable(true);
    setUsernameToUpdate(username);
    setIsUserDeactivate(option);
  };

  return (
    <>
      <UserDeleteModal
        isOpen={isUserDelete}
        onClose={onModalsCloses}
        username={usernameToUpdate ?? ""}
        executor="admin"
      />
      <UserDisableModal
        isOpen={isUserDisable}
        onClose={onModalsCloses}
        token={token}
        username={usernameToUpdate ?? ""}
        isDeactivate={isUserDeactivate}
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
            <TableHead>Status Akun</TableHead>
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
                {user.is_disabled ? "Dinonaktifkan" : "Aktif"}
              </TableCell>
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
                    {user.is_disabled ? (
                      <DropdownMenuItem
                        className="hover:bg-secondary hover:text-secondary-foreground cursor-pointer"
                        onClick={() => onUserDisable(user.username, false)}
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        <span>Aktifkan Akun</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="hover:bg-secondary hover:text-secondary-foreground cursor-pointer"
                        onClick={() => onUserDisable(user.username, true)}
                      >
                        <BanIcon className="w-4 h-4 mr-2" />
                        <span>Nonaktifkan Akun</span>
                      </DropdownMenuItem>
                    )}
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
