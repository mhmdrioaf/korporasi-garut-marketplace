"use client";

import { TUser } from "@/lib/globals";
import { Loader2Icon, Trash2Icon, User2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ACCOUNT_DELETE_NOTES, IMAGE_UPLOAD_NOTES } from "@/lib/constants";
import { useState } from "react";
import UserDetailModals from "@/components/ui/modals/user-detail";
import imageCompression from "browser-image-compression";
import { remoteImageSource, uploadImage } from "@/lib/helper";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import supabase from "@/lib/supabase";
import UserDeleteModal from "./modals/user-delete";

interface IUserDashboardComponentProps {
  user: TUser;
}

type TUserDetailChangeOptions = "name" | "username" | "phone_number" | null;

export default function UserDashboardComponent({
  user,
}: IUserDashboardComponentProps) {
  const [modalOptions, setModalOptions] =
    useState<TUserDetailChangeOptions | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUserDelete, setIsUserDelete] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState<string | null>(null);
  const [profilePictureLoading, setProfilePictureLoading] =
    useState<boolean>(false);

  const { toast } = useToast();
  const { update } = useSession();
  const router = useRouter();

  const onImageInputChangesHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfilePictureLoading(true);
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      const compressedImage = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      });
      const userImage = await uploadImage(
        compressedImage,
        `${user.username}/profile-picture.jpg`,
        "users"
      );
      if (userImage.imageURL) {
        const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATE_USER!, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataToChange: "profile_picture",
            dataValue: userImage.imageURL,
            userId: user.user_id.toString(),
          }),
        });

        const response = await res.json();
        if (!response.ok) {
          setProfilePictureLoading(false);
          toast({
            variant: "destructive",
            title: "Gagal mengunggah foto",
            description: response.message,
          });
        } else {
          setProfilePictureLoading(false);
          toast({
            variant: "success",
            title: "Berhasil mengunggah foto",
            description: response.message,
          });
          update();
          router.refresh();
        }
      }
    }
  };

  const onImageDeleteHandler = async () => {
    setProfilePictureLoading(true);

    try {
      const { error } = await supabase.storage
        .from("users")
        .remove([`${user.username}/profile-picture.jpg`]);
      if (error) {
        setProfilePictureLoading(false);
        toast({
          variant: "destructive",
          description:
            "Terjadi kesalahan ketika menghapus foto profil, silahkan coba lagi nanti atau hubungi developer jika masalah berlanjut.",
        });
      } else {
        const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATE_USER!, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataToChange: "profile_picture",
            dataValue: null,
            userId: user.user_id.toString(),
          }),
        });

        const response = await res.json();
        if (!response.ok) {
          setProfilePictureLoading(false);
          toast({
            variant: "destructive",
            title: "Gagal menghapus foto",
            description: response.message,
          });
        } else {
          setProfilePictureLoading(false);
          toast({
            variant: "success",
            title: "Berhasil menghapus foto",
            description: response.message,
          });
          update();
          router.refresh();
        }
      }
    } catch (err) {
      setProfilePictureLoading(false);
      console.error(err);
    }
  };

  const onUserDetailChanges = (
    options: TUserDetailChangeOptions,
    defaultValue: string
  ) => {
    setModalOptions(options);
    setModalValue(defaultValue);
    setIsModalOpen(true);
  };

  const onModalCloses = () => {
    setModalOptions(null);
    setIsModalOpen(false);
    setIsUserDelete(false);
    setModalValue(null);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <UserDetailModals
        options={modalOptions}
        userId={user.user_id.toString()}
        defaultValue={modalValue ?? ""}
        isOpen={isModalOpen}
        onClose={onModalCloses}
      />
      <UserDeleteModal
        isOpen={isUserDelete}
        onClose={onModalCloses}
        username={user.username}
      />
      <div className="w-full p-2 rounded-md overflow-hidden flex flex-col gap-4 border border-input">
        <div className="w-full h-auto aspect-square grid place-items-center rounded-md border border-input overflow-hidden relative">
          {profilePictureLoading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : user.account?.profile_picture ? (
            <Image
              src={remoteImageSource(user.account.profile_picture)}
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

        <Button
          asChild
          variant="outline"
          className="cursor-pointer"
          disabled={profilePictureLoading}
        >
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

        {user.account?.profile_picture && (
          <Button
            variant="destructive"
            disabled={profilePictureLoading}
            onClick={() => onImageDeleteHandler()}
          >
            Hapus Foto Profil
          </Button>
        )}

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
              <td className="ml-1 mr-1">:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.account?.user_name}</p>
                <Button
                  variant="ghost"
                  className="text-primary font-bold"
                  onClick={() =>
                    onUserDetailChanges("name", user.account?.user_name ?? "")
                  }
                >
                  Ubah
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Email</p>
              </td>
              <td className="ml-1 mr-1">:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.email}</p>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Nama Pengguna</p>
              </td>
              <td className="ml-1 mr-1">:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.username}</p>
                <Button
                  variant="ghost"
                  className="text-primary font-bold"
                  onClick={() => onUserDetailChanges("username", user.username)}
                >
                  Ubah
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <p className="font-bold">Nomor Telepon</p>
              </td>
              <td className="ml-1 mr-1">:</td>
              <td className="flex flex-row items-center gap-1">
                <p>{user.phone_number}</p>
                <Button
                  variant="ghost"
                  className="text-primary font-bold"
                  onClick={() =>
                    onUserDetailChanges("phone_number", user.phone_number ?? "")
                  }
                >
                  Ubah
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full p-2 mb-20 lg:mb-0 flex flex-col gap-4 rounded-md border border-input">
          <p className="text-xl text-red-700 font-bold">Aksi Berbahaya</p>
          <p className="text-sm text-stone-700">{ACCOUNT_DELETE_NOTES}</p>
          <Button variant="destructive" onClick={() => setIsUserDelete(true)}>
            <Trash2Icon className="w-4 h-4 mr-2" />
            <span>Hapus Akun</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
