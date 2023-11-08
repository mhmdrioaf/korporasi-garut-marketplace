import { TNotification } from "../globals";

export async function readNotification(
    body: {
        notification_id: string, 
        notification_item_id: string
    }
) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_READ!, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            notification_id: body.notification_id,
            notification_item_id: body.notification_item_id
        })
    })

    const response = await res.json();

    if (response.ok) {
        return response.result as TNotification
    } else {
        return undefined
    }
}