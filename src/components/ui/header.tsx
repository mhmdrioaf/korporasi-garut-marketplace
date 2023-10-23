"use client";
import Link from "next/link";
import logo from "../../../public/smk_logo.png";
import {
  BellIcon,
  BookKeyIcon,
  BoxesIcon,
  FacebookIcon,
  GanttChartSquareIcon,
  InstagramIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingCartIcon,
  TwitterIcon,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import SearchBar from "./search-bar";
import { Button } from "./button";
import { Session } from "next-auth";
import { getAvatarInitial, remoteImageSource } from "@/lib/helper";
import { ROUTES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { signOut } from "next-auth/react";
import useSWR from "swr";
import { TCustomerCart } from "@/lib/globals";

interface IHeaderComponentProps {
  session: Session | null;
}

export default function Header({ session }: IHeaderComponentProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { data: cartData, isLoading: cartLoading } = useSWR(
    "/api/cart-list",
    (url) =>
      fetch(url, {
        headers: {
          user_id: session ? session.user.id : "",
        },
      })
        .then((res) => res.json())
        .then((res) => res.result as TCustomerCart)
  );

  const onButtonLinkClickHandler = (options: "LOGIN" | "REGISTER") => {
    if (options === "LOGIN") {
      router.push(ROUTES.AUTH.LOGIN);
    } else {
      router.push(ROUTES.AUTH.REGISTER);
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
    <div className="w-full flex flex-col overflow-hidden sticky top-0 left-0 z-50 border-b border-b-stone-300 bg-background">
      <div className="w-full px-8 py-2 md:px-16 bg-slate-200 text-stone-800 flex flex-row items-center text-sm justify-between">
        <div className="flex flex-row items-center gap-1">
          <p>Ikuti kami di</p>
          <Link target="_blank" href="https://facebook.com/mr.r3v">
            <FacebookIcon className="w-4 h-4" />
          </Link>
          <Link target="_blank" href="https://instagram.com/mhmdrioaf">
            <InstagramIcon className="w-4 h-4" />
          </Link>
          <Link target="_blank" href="https://twitter.com/oirioir">
            <TwitterIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-row items-center gap-1 min-h-full">
          <Link href="#">Tentang SMKs Korporasi Garut</Link>
          <span>|</span>
          <Link href="#">Bantuan</Link>
          <span>|</span>
          <Link href="#">Promo</Link>
        </div>
      </div>

      <div className="w-full flex flex-row items-center self-stretch justify-center gap-4 px-8 py-2 md:px-16">
        <Link
          href={ROUTES.LANDING_PAGE}
          className="flex flex-row gap-4 items-center shrink-0 select-none"
        >
          <Image
            src={logo}
            width={64}
            height={64}
            alt="Logo SMK"
            sizes="100vw"
          />
          <div className="flex flex-col text-primary font-bold">
            <p>SMKs Korporasi Garut</p>
            <p>Marketplace</p>
          </div>
        </Link>

        <SearchBar />

        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <div className="relative">
              <Link href={ROUTES.USER.CART}>
                <ShoppingCartIcon className="w-4 h-4" />
              </Link>
              <div className="w-6 h-6 text-xs rounded-full p-1 text-center bg-destructive text-destructive-foreground absolute -top-1 -right-1">
                {cartLoading && (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                )}
                {cartData ? <p>{cartData.cart_items.length}</p> : "0"}
              </div>
            </div>
          </Button>
          <span>|</span>
          <Button variant="ghost" size="icon">
            <BellIcon className="w-4 h-4" />
          </Button>
        </div>

        {session && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-row items-center gap-2 select-none cursor-pointer">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative grid place-items-center border border-input">
                    {session.user.image ? (
                      <Image
                        src={remoteImageSource(session.user.image)}
                        fill
                        className="object-cover"
                        alt="Foto profil"
                        sizes="100vw"
                      />
                    ) : (
                      <p>{getAvatarInitial(session.user.name!)}</p>
                    )}
                  </div>
                  <MenuIcon className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-52 mr-4">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span>{session.user.username}</span>
                  {session.user.role !== "CUSTOMER" && (
                    <span className="text-xs font-normal">
                      {session.user.role === "ADMIN"
                        ? "Administrator"
                        : "Penjual"}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href={ROUTES.USER.DASHBOARD}
                      className="w-full flex flex-row"
                    >
                      <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem>
                        <Link
                          href={ROUTES.ADMIN.DASHBOARD}
                          className="w-full flex flex-row"
                        >
                          <BookKeyIcon className="w-4 h-4 mr-2" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link
                          href={ROUTES.USER.PRODUCTS_LIST}
                          className="w-full flex flex-row"
                        >
                          <BoxesIcon className="w-4 h-4 mr-2" />
                          <span>Manajemen Produk</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {session.user.role === "SELLER" && (
                    <>
                      <DropdownMenuItem>
                        <Link
                          href={ROUTES.USER.PRODUCTS_LIST}
                          className="w-full flex flex-row"
                        >
                          <BoxesIcon className="w-4 h-4 mr-2" />
                          <span>Manajemen Produk</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem
                    className="py-2 bg-destructive text-destructive-foreground cursor-pointer hover:bg-destructive/95"
                    onClick={signOutHandler}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {!session && (
          <div className="flex flex-row items-center gap-2">
            <span className="hidden lg:inline-flex gap-4">
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="px-4 py-2 rounded-md bg-primary bg-opacity-25 text-primary-foreground hover:bg-opacity-100 transition-colors grid place-items-center"
              >
                Login
              </Link>
              <div className="w-px min-h-full bg-stone-300" />
              <Link
                href={ROUTES.AUTH.REGISTER}
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
                      <LogInIcon className="mr-2 h-2 w-2" />
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
          </div>
        )}
      </div>
    </div>
  );
}
