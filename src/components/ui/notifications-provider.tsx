"use client";

import { NotificationContextProvider } from "@/lib/hooks/context/useNotifications";
import { NotificationContent, NotificationTrigger } from "./notifications";

interface INotificationProviderProps {
  notification: TNotification | null;
}

export default function NotificationsProvider({
  notification,
}: INotificationProviderProps) {
  return (
    <NotificationContextProvider notification={notification}>
      <div className="relative">
        <NotificationTrigger />
        <NotificationContent className="absolute top-12 -left-[10rem] md:-left-[22rem] z-[70]" />
      </div>
    </NotificationContextProvider>
  );
}
