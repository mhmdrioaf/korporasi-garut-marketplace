"use client";

import { registerSchema } from "@/lib/resolver/authResolver";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../use-toast";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Separator } from "../separator";
import Link from "next/link";
import { capitalizeFirstWord } from "@/lib/helper";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AuthRegister() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      phone_number: "",
      username: "",
      password: "",
      password_confirmations: "",
    },
    mode: "onBlur",
  });

  const router = useRouter();

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { password_confirmations, ...data } = values;

    if (password_confirmations !== values.password) {
      form.setError(
        "password_confirmations",
        {
          type: "validate",
          message: "Password dan konfirmasi password harus sama",
        },
        { shouldFocus: true }
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_REGISTER!, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const registerResponse = await res.json();

      if (!registerResponse.ok) {
        setLoading(false);
        toast({
          title: "Proses daftar gagal.",
          description: `${capitalizeFirstWord(
            registerResponse.error[0] === "phone_number"
              ? "nomor telepon"
              : registerResponse.error[0]
          )} telah terdaftar.`,
          variant: "destructive",
        });
      } else {
        return await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
        })
          .then(() => {
            toast({
              title: "Proses daftar berhasil.",
              description: "Mengarahkan ke halaman dashboard...",
              variant: "success",
            });
            setLoading(false);
            form.reset();
            router.refresh();
            router.push(ROUTES.USER.DASHBOARD);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } catch (err) {
      setLoading(false);
      toast({
        title: "Terjadi kesalahan",
        description:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
        variant: "destructive",
      });
      console.error(err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:w2/3 rounded-lg overflow-hidden flex flex-col gap-4 lg:gap-8 border border-stone-300 p-4 lg:p-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="contoh@mail.com" {...field} />
              </FormControl>
              <FormDescription>
                Email digunakkan untuk menerima pemberitahuan dan/atau untuk
                proses login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pengguna</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johnsmith" {...field} />
              </FormControl>
              <FormDescription>
                Nama pengguna digunakan untuk memudahkan proses login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor telepon</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="08xxx"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Format nomor telepon adalah sebagai berikut: <b>08xxxx</b>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password_confirmations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
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

        <Button type="submit" variant="default" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Daftar"
          )}
        </Button>

        <Separator />

        <Link
          href={ROUTES.AUTH.LOGIN}
          className="w-full rounded-md bg-background border border-stone-200 hover:bg-stone-100 transition-colors px-4 py-2 grid place-items-center text-sm font-medium"
        >
          Login
        </Link>
      </form>
    </Form>
  );
}
