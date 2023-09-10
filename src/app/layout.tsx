import Header from "@/components/ui/header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/lib/AuthProvider";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace | SMKS Korporasi Garut",
  description: "SMKS Korporasi Garut official marketplace website.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main>
            <Header session={session} />
            {children}
          </main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
