"use client";

import { IUser } from "@/lib/globals";
import { Trash2Icon, User2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { Input } from "./input";
import { useRef } from "react";
import { Label } from "./label";
import { ACCOUNT_DELETE_NOTES, IMAGE_UPLOAD_NOTES } from "@/lib/constants";

interface UserDashboardComponentProps {
  user: IUser;
}

export default function UserDashboardComponent({
  user,
}: UserDashboardComponentProps) {
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const onUploadImageClickHandler = () => {
    if (imageUploadInputRef.current) {
      imageUploadInputRef.current.click();
    } else {
      return;
    }
  };

  const onImageInputChangesHandler = () => {};

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="w-full p-2 rounded-md overflow-hidden flex flex-col gap-4 border border-input">
        <div className="w-full h-auto aspect-square rounded-md border border-input overflow-hidden relative">
          {user.account?.profile_picture ? (
            <Image
              src={user.account.profile_picture}
              alt="foto profil"
              fill
              className="object-cover"
              sizes="75vw"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <User2Icon className="w-16 h-16" />
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="cursor-pointer">
          <Label htmlFor="profile-picture">Unggah Gambar</Label>
        </Button>
        <Input
          id="profile-picture"
          type="file"
          accept="image/*"
          onChange={onImageInputChangesHandler}
          hidden
          className="hidden"
        />

        <p className="text-sm">
          <b>Note:</b> {IMAGE_UPLOAD_NOTES}
        </p>
      </div>

      <div className="w-full col-span-1 lg:col-span-2 flex flex-col gap-8">
        <table className="w-full p-2 flex flex-col gap-2 rounded-md border border-input">
          <thead className="flex items-center justify-start">
            <tr>
              <th colSpan={3} className="text-xl font-bold text-primary">
                Informasi Akun
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <p className="font-bold">Nama</p>
              </td>
              <td>:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.account?.user_name}</p>
                <Button variant="ghost" className="text-primary font-bold">
                  Ubah
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Email</p>
              </td>
              <td>:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.email}</p>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Nama Pengguna</p>
              </td>
              <td>:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.username}</p>
                <Button variant="ghost" className="text-primary font-bold">
                  Ubah
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Nomor Telepon</p>
              </td>
              <td>:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.phone_number}</p>
                <Button variant="ghost" className="text-primary font-bold">
                  Ubah
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full p-2 flex flex-col gap-4 rounded-md border border-input">
          <p className="text-xl text-red-700 font-bold">Aksi Berbahaya</p>
          <p className="text-sm text-stone-700">{ACCOUNT_DELETE_NOTES}</p>
          <Button variant="destructive">
            <Trash2Icon className="w-4 h-4 mr-2" />
            <span>Hapus Akun</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
