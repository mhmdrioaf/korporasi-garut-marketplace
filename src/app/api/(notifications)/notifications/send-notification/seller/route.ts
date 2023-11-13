import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface INotificationSendBody {
    seller_id: string;
};

async function handler (request: NextRequest) {
    const body: INotificationSendBody = await request.json();

    try {
        const sendNotification = await db.notification.upsert({
            where: {
                subscriber_id: parseInt(body.seller_id)
            },
            create: {
                subscriber_id: parseInt(body.seller_id),
                items: {
                    create: {
                        title: "Pesanan baru telah diterima.",
                        redirect_url: "/seller/dashboard/orders?state=PAID"
                    }
                }
            },
            update: {
                items: {
                    create: {
                        title: "Pesanan baru telah diterima.",
                        redirect_url: "/seller/dashboard/orders?state=PAID"
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
};

export { handler as POST }