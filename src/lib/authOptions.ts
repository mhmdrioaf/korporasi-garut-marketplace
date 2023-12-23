import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { ROUTES } from "./constants";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials) {
        const authResponse = await fetch(process.env.NEXT_PUBLIC_API_LOGIN!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await authResponse.json();

        if (authResponse.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.user_id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.token = token.token;
        session.user.image = token.picture;
      }
      return session;
    },

    async jwt({ token, user }) {
      const loggedInUser = await db.user.findFirst({
        where: { email: token.email! },
        include: {
          account: true,
        },
      });
      if (loggedInUser) {
        token.user_id = loggedInUser.user_id.toString();
        token.name = loggedInUser.account?.user_name;
        token.email = loggedInUser.email;
        token.role = loggedInUser.role;
        token.username = loggedInUser.username;
        token.token = loggedInUser.token;
        token.picture = loggedInUser.account?.profile_picture;
        return token;
      } else {
        token.user_id = user.id;
        return token;
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: ROUTES.AUTH.LOGIN,
  },
};

export default authOptions;
