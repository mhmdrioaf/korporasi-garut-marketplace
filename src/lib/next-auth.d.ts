import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    user_id: UserId;
    username?: string | null;
    role: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      user_id: UserId;
      username?: string | null;
      role: string;
    };
  }
}
