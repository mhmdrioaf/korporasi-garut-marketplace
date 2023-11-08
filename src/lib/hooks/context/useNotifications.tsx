"use client";

import { createContext, useContext, useState } from "react";
import { TNotificationContext } from "./notificationContext";
import useSWR from "swr";
import { fetcher } from "@/lib/helper";

export const NotificationContext = createContext<TNotificationContext | null>(null);

export function useNotifications() {
    return useContext(NotificationContext) as TNotificationContext;
};

interface INotificationContextProviderProps {
    children: React.ReactNode;
    subscriber_id: string;
}

export function NotificationContextProvider({ children, subscriber_id }: INotificationContextProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(prev => !prev)
    }

    const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError, isValidating: notificationsValidating } = useSWR("/api/notifications/get", fetcher);

    const value: TNotificationContext = {
        data: {
            notification: notificationsData ? notificationsData.result : null
        },
        state: {
            loading: notificationsLoading || notificationsValidating,
            error: notificationsError,
            isOpen: isOpen
        },
        handler: {
            toggleOpen: toggleOpen
        }
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}