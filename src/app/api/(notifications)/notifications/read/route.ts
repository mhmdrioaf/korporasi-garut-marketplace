import { db } from "@/lib/db";
import { TNotification } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface INotificationReadBody {
    notification_id: string;
    notification_item_id: string;
}

async function handler(request: NextRequest) {
    const body: INotificationReadBody = await request.json();

    try {
        const readNotification = await db.notification.update({
            where: {
                notification_id: body.notification_id
            },
            data: {
                items: {
                    update: {
                        where: {
                            notification_item_id: body.notification_item_id
                        },
                        data: {
                            status: "READ",
                            show_action_button: false
                        }
                    }
                }
            },
            include: {
                items: {
                    orderBy: {
                        status: "asc"
                    }
                }
            }
        })

        if (readNotification) {
            return NextResponse.json({ ok: true, message: "Notifikasi telah dibaca.", result: readNotification as TNotification })
        } else {
            return NextResponse.json({ ok: false, message: "Gagal membaca notifikasi.", result: null})
        }
    } catch (error) {
        console.error("An error occurred when reading the notification: ", error);
        return NextResponse.json({ ok: false, message: "Gagal membaca notifikasi." })
    }
}

export { handler as PATCH }