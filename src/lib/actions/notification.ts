import { TNotification } from "../globals";

export async function readNotificationHandler(
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

export async function deleteNotificationHandler(
    body: {
        notification_id: string, 
        notification_item_id: string
    }
) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_DELETE!, {
        method: "DELETE",
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

export async function readAllNotificationsHandler(
    body: {
        notification_id: string
    }
) {
    const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            notification_id: body.notification_id
        })
    })

    const response = await res.json();

    if (response.ok) {
        return response.result as TNotification
    } else {
        return undefined
    }
}