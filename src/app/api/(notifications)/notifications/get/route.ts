import authOptions from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function handler (request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session) {
        try {
            const userNotification = await db.notification.findUnique({
                where: {
                    subscriber_id: parseInt(session.user.id)
                },
                include: {
                    items: true
                }
            });

            if (userNotification) {
                return NextResponse.json({ ok: true, result: userNotification })
            } else {
                return NextResponse.json({ ok: false, result: null })
            }
        } catch (error) {
            console.error("An error occurred when getting the user notification: ", error)
            return NextResponse.json({ ok: false, result: null })
        }
    } else {
        return NextResponse.json({ ok: false, result: null })
    }
}

export { handler as GET }