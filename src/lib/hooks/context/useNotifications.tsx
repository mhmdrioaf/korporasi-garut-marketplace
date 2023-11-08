"use client";

import { createContext, useContext, useState } from "react";
import { TNotificationContext } from "./notificationContext";
import useSWR, { mutate, useSWRConfig } from "swr";
import { fetcher } from "@/lib/helper";
import { readNotification } from "@/lib/actions/notification";
import { useRouter } from "next/navigation";
import { TNotification } from "@/lib/globals";

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

    const router = useRouter();

    const toggleOpen = () => {
        setIsOpen(prev => !prev)
    }

    const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError, isValidating: notificationsValidating, mutate} = useSWR("/api/notifications/get", fetcher);

    const readNotifications = async (
        body: {
            notification_id: string;
            notification_item_id: string;
        }
    ) => {
        let currentNotifications: TNotification = notificationsData.result;
        let currentNotificationItems = currentNotifications.items;
        let currentNotificationItem = currentNotificationItems.find(item => item.notification_item_id === body.notification_item_id);
        currentNotificationItem!.status = "READ";

        try {
            await mutate(readNotification(body), {
                optimisticData: currentNotifications,
                rollbackOnError: true,
                populateCache: true,
                revalidate: false
            })
        } catch (error) {
            console.error("Error reading notification", error)
        }
    }

    const actionButtonClick = async (
        body: {
            notification_id: string;
            notification_item_id: string;
            redirect_url: string;
        }
    ) => {
        router.push(body.redirect_url);
        await readNotifications({
            notification_item_id: body.notification_item_id,
            notification_id: body.notification_id
        })
    }

    const value: TNotificationContext = {
        data: {
            notification: notificationsData ? notificationsData.result : null
        },
        state: {
            loading: notificationsLoading || notificationsValidating,
            error: notificationsError,
            isOpen: isOpen,
        },
        handler: {
            toggleOpen: toggleOpen,
            read: readNotifications,
            actionButtonClick: actionButtonClick
        }
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}