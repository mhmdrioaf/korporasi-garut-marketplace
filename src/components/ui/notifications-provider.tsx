"use client";

import { NotificationContextProvider } from "@/lib/hooks/context/useNotifications";
import { NotificationContent, NotificationTrigger } from "./notifications";

interface INotificationProviderProps {
    subscriber_id: string;
};

export default function NotificationsProvider({ subscriber_id }: INotificationProviderProps) {
    return (
        <NotificationContextProvider subscriber_id={subscriber_id}>
            <div className="relative">
                <NotificationTrigger />
                <NotificationContent className="absolute top-12 -left-[22rem] z-[70]" />
            </div>
        </NotificationContextProvider>
    )
}