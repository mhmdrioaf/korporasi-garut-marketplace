import Header from "@/components/ui/header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/lib/AuthProvider";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { getUserCart, getUserNotification } from "@/lib/api";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace | SMKS Korporasi Garut",
  description: "SMKS Korporasi Garut official marketplace website.",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let cart: TCustomerCart | null = null;
  let notification: TNotification | null = null;
  if (session) {
    cart = await getUserCart(parseInt(session.user.id));
    notification = await getUserNotification(session.user.id);
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main>
            <Header session={session} cart={cart} notification={notification} />
            {children}
            <Footer />
          </main>
          {modal}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
