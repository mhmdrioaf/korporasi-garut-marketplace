import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface INotificationReadAllBody {
    notification_id: string;
};

async function handler(request: NextRequest) {
    const body: INotificationReadAllBody = await request.json();

    try {
        const readAllNotifications = await db.notification.update({
            where: {
                notification_id: body.notification_id
            },
            data: {
                items: {
                    updateMany: {
                        where: {
                            status: "UNREAD"
                        },
                        data: {
                            status: "READ"
                        }
                    }
                }
            },
            include: {
                items: {
                    orderBy: {
                        notifiedAt: "desc"
                    }
                }
            }
        });

        if (readAllNotifications) {
            return NextResponse.json({ ok: true, result: readAllNotifications  })
        } else {
            return NextResponse.json({ ok: false, result: null })
        }
    } catch (error) {
        console.error("An error occurred while reading all notifications", error);
        return NextResponse.json({ ok: false, result: null })
    }
};

export { handler as PATCH };