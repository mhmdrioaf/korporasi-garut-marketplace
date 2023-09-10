"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authSchema } from "@/lib/resolver/authResolver";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { useState } from "react";
import { Button } from "../button";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Separator } from "../separator";
import { useToast } from "../use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginOptions = "username" | "email";

export default function AuthLogin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [loginOptions, setLoginOptions] = useState<LoginOptions>("username");

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      email: "contoh@mail.com",
      password: "",
    },
  });

  const loginMethodChangeHandler = () => {
    if (loginOptions === "email") {
      form.setValue("email", "contoh@mail.com");
      form.setValue("username", "");

      setLoginOptions("username");
    } else {
      form.setValue("email", "");
      form.setValue("username", "");

      setLoginOptions("email");
    }
  };

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setLoading(true);
    const { username, email, password } = values;

    return await signIn("credentials", {
      redirect: false,
      username: username ? username : email,
      password: password,
    })
      .then((res) => {
        if (res?.error) {
          toast({
            title: "Proses masuk gagal",
            description:
              "Username/email atau password yang anda masukkan salah.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Berhasil masuk.",
            description: "Selamat datang kembali.",
            variant: "success",
          });
          form.reset();
          router.refresh();
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Terjadi kesalahan...",
          description:
            "Telah terjadi kesalahan ketika melakukan proses login, silahkan coba lagi nanti.",
          variant: "destructive",
        });
        console.error(err);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:w-2/3 rounded-lg overflow-hidden flex flex-col gap-4 lg:gap-8 border border-stone-300 p-4 lg:p-8"
      >
        {loginOptions === "username" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pengguna</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {loginOptions === "email" && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contoh@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="w-full flex flex-row items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*******"
                    {...field}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col gap-2 lg:gap-4">
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
          <Separator />
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => loginMethodChangeHandler()}
          >
            Masuk dengan menggunakan{" "}
            {loginOptions === "email" ? "username" : "email"}
          </Button>
          <div className="w-full flex flex-row items-center gap-2">
            <div className="w-full h-px bg-stone-200" />
            <p className="text-sm text-stone-600">ATAU</p>
            <div className="w-full h-px bg-stone-200" />
          </div>
          <Link
            href="/auth/register"
            className="w-full rounded-md bg-background border border-stone-200 hover:bg-stone-100 transition-colors px-4 py-2 grid place-items-center text-sm font-medium"
          >
            Daftar
          </Link>
        </div>
      </form>
    </Form>
  );
}
