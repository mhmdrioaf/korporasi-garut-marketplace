import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface INotificationSendBody {
    subscriber_target: string;
    notification_title: string;
    notification_redirect_url: string;
};

async function handler (request: NextRequest) {
    const body: INotificationSendBody = await request.json();

    try {
        const sendNotification = await db.notification.upsert({
            where: {
                subscriber_id: parseInt(body.subscriber_target)
            },
            create: {
                subscriber_id: parseInt(body.subscriber_target),
                items: {
                    create: {
                        title: body.notification_title,
                        redirect_url: body.notification_redirect_url,
                    }
                }
            },
            update: {
                items: {
                    create: {
                        title: body.notification_title,
                        redirect_url: body.notification_redirect_url,
                    }
                }
            },
        })

        if (sendNotification) {
            return NextResponse.json({ ok: true });
        } else {
            return NextResponse.json({ ok: false })
        }
    } catch (error) {
        console.error("An error occurred while sending notification", error);
        return NextResponse.json({ ok: false })
    }
}

export { handler as POST }