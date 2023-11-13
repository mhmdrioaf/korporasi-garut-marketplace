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
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_READ_ALL!, {
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

export async function deleteAllNotificationsHandler(
    body: {
        notification_id: string
    }
) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_DELETE_ALL!, {
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

export async function sendNotificationHandler(
    body: {
        subscriber_target: string;
        notification_title: string;
        notification_redirect_url: string;
    }
) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_SEND!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subscriber_target: body.subscriber_target,
            notification_title: body.notification_title,
            notification_redirect_url: body.notification_redirect_url,
        })
    })

    const response = await res.json();

    if (response.ok) {
        return response.result as TNotification
    } else {
        return undefined
    }
}

export async function sendSellerNotificationHandler(
    body: {
        seller_id: string;
    }
) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_NOTIFICATION_SEND_SELLER!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            seller_id: body.seller_id,
        })
    })

    const response = await res.json();

    if (response.ok) {
        return response.result as TNotification
    } else {
        return undefined
    }
}