import { TNotification } from "@/lib/globals"

type TNotificationContext = {
    data: {
        notification: TNotification | null,
    }
    state: {
        loading: boolean,
        error: any
        isOpen: boolean,
    }
    handler: {
        toggleOpen: () => void;
    }
}