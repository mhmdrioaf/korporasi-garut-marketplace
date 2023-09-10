"use client";

import Image from "next/image";
import logo from "../../../public/smk_logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import {
  GanttChartSquareIcon,
  Loader2Icon,
  LogIn,
  LogOut,
  Menu,
  User2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getAvatarInitial } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Session } from "next-auth";
import { useToast } from "./use-toast";

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const activeStyles = "font-bold text-primary";
  const baseLinkStyles =
    "p-2 rounded-lg grid place-items-center w-full hover:bg-primary hover:text-primary-foreground";
  const linkStyles = {
    default: " bg-background text-foreground",
    active: " bg-primary text-primary-foreground",
  };

  const onButtonLinkClickHandler = (options: "LOGIN" | "REGISTER") => {
    if (options === "LOGIN") {
      router.push("/auth/login");
    } else {
      router.push("/auth/register");
    }
  };

  const signOutHandler = async () => {
    return await signOut()
      .then(() => {
        toast({
          title: "Berhasil keluar.",
          description: "Berhasil mengeluarkan akun.",
          variant: "success",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="w-full px-16 lg:px-8 py-2 border-b border-b-stone-300 sticky top-0 left-0 grid grid-cols-3 place-items-center bg-background z-50">
      <div className="gap-4 justify-self-start hidden lg:inline-flex">
        <Link className={pathname === "/" ? activeStyles : ""} href="/">
          Marketplace
        </Link>
        <Link className={pathname === "/ee" ? activeStyles : ""} href="#">
          Kategori
        </Link>
        <Link className={pathname === "/rr" ? activeStyles : ""} href="#">
          FAQs
        </Link>
      </div>

      <span className="justify-self-start lg:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="p-2 rounded-md border border-stone-200 grid place-items-center">
              <Menu className="w-6 h-6" />
            </div>
          </SheetTrigger>

          <SheetContent className="w-full flex flex-col gap-8" side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="w-full flex flex-col gap-4">
              <Link
                className={
                  pathname === "/"
                    ? baseLinkStyles + linkStyles.active
                    : baseLinkStyles
                }
                href="/"
              >
                Marketplace
              </Link>
              <Link
                className={
                  pathname === "#"
                    ? baseLinkStyles + linkStyles.active
                    : baseLinkStyles
                }
                href="#"
              >
                Kategori
              </Link>
              <Link
                className={
                  pathname === "#"
                    ? baseLinkStyles + linkStyles.active
                    : baseLinkStyles
                }
                href="#"
              >
                FAQs
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </span>

      <div className="w-16 h-16 relative">
        <Image
          src={logo}
          alt="smk logo"
          fill
          className="object-center"
          sizes="100vw"
        />
      </div>

      <div className="gap-4 justify-self-end inline-flex">
        {session === null ? (
          <>
            <span className="hidden lg:inline-flex gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md bg-primary bg-opacity-25 text-primary-foreground hover:bg-opacity-100 transition-colors grid place-items-center"
              >
                Login
              </Link>
              <div className="w-px min-h-full bg-stone-300" />
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-md bg-background text-foreground hover:bg-stone-100 transition-colors grid place-items-center border border-stone-200"
              >
                Daftar
              </Link>
            </span>

            <span className="block lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-12 h-12 cursor-pointer">
                    <AvatarFallback className="bg-background border border-stone-300">
                      <User2Icon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52 mr-4">
                  <DropdownMenuLabel>Akun</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="flex flex-col gap-2">
                    <DropdownMenuItem
                      className="bg-primary text-primary-foreground cursor-pointer"
                      onClick={() => onButtonLinkClickHandler("LOGIN")}
                    >
                      <LogIn className="mr-2 h-2 w-2" />
                      <span>Login</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => onButtonLinkClickHandler("REGISTER")}
                    >
                      <GanttChartSquareIcon className="mr-2 h-2 w-2" />
                      <span>Daftar</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-12 h-12 cursor-pointer">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt="Profile pic"
                />
                <AvatarFallback className="bg-background border border-stone-300">
                  {getAvatarInitial(session.user.name!)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52 mr-4">
              <DropdownMenuLabel>
                <span>{session.user.username}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 bg-destructive text-destructive-foreground cursor-pointer hover:bg-destructive/95"
                onClick={signOutHandler}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
