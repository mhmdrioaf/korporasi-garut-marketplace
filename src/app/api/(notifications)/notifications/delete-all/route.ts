import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface INotificationDeleteAllBody {
    notification_id: string;
};

async function handler (request: NextRequest) {
    const body: INotificationDeleteAllBody = await request.json();

    try {
        const deleteAllItems = await db.notification.update({
            where: {
                notification_id: body.notification_id
            },
            data: {
                items: {
                    deleteMany: {
                        notification_id: body.notification_id
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

        if (deleteAllItems) {
            return NextResponse.json({ ok: true, result: deleteAllItems });
        } else {
            return NextResponse.json({ ok: false, result: null });
        }
    } catch (error) {
        console.error("An error occurred while deleting all notifications", error);
        return NextResponse.json({ ok: false, result: null });
    }
};

export { handler as PATCH }