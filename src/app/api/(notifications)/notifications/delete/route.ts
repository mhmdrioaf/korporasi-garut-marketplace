import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface INotificationDeleteBody {
    notification_id: string;
    notification_item_id: string;
};

async function handler(request: NextRequest) {
    const body: INotificationDeleteBody = await request.json();

    try {
        const deleteNotification = await db.notification.update({
            where: {
                notification_id: body.notification_id
            },
            data: {
                items: {
                    delete: {
                        notification_item_id: body.notification_item_id
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
        });

        if (deleteNotification) {
            return NextResponse.json({ ok: true, result: deleteNotification })
        } else {
            return NextResponse.json({ ok: false, result: null })
        }
    } catch (error) {
        console.error("An error occurred while deleting notification item: ", error);
        return NextResponse.json({ ok: false, result: null })
    }
};

export { handler as DELETE }