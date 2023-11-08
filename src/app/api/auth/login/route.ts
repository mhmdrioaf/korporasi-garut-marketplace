import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";

interface ILoginRequestBody {
  username: string;
  password: string;
}

async function handler(request: NextRequest) {
  const body: ILoginRequestBody = await request.json();

  const users = new Users(db.user);
  const user = await users.login(body);

  if (user) {
    const userNotification = await db.notification.findUnique({
      where: {
        subscriber_id: user.user_id
      }
    });

    if (!userNotification) {
      const initializeNotification = await db.notification.create({
        data: {
          subscriber_id: user.user_id
        }
      });

      if (!initializeNotification) {
        console.error("An error occurred when initializing the notification.");
      }
    }
  }

  return new NextResponse(JSON.stringify(user));
}

export { handler as POST };
