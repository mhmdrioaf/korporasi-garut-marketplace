"use client";

import Image from "next/image";
import logo from "../../../public/smk_logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import { Menu, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getAvatarInitial } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

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
            <Button
              variant="outline"
              className="lg:hidden justify-self-start"
              size="icon"
            >
              <Menu className="w-4 h-4" />
            </Button>
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
        {status === "unauthenticated" && (
          <>
            <span className="hidden lg:inline-flex gap-4">
              <Button
                variant="default"
                onClick={() => onButtonLinkClickHandler("LOGIN")}
              >
                Login
              </Button>
              <div className="w-px min-h-full bg-stone-300" />
              <Button
                variant="outline"
                onClick={() => onButtonLinkClickHandler("REGISTER")}
              >
                Daftar
              </Button>
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

                <DropdownMenuContent className="mr-4">
                  <DropdownMenuItem>
                    <Button
                      variant="default"
                      onClick={() => onButtonLinkClickHandler("LOGIN")}
                      className="w-full"
                    >
                      Login
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Button
                      variant="outline"
                      onClick={() => onButtonLinkClickHandler("REGISTER")}
                      className="w-full"
                    >
                      Daftar
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </>
        )}

        {status === "authenticated" && (
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

            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
              <Separator />
              <DropdownMenuItem>
                <Button
                  variant="destructive"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  Keluar
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
