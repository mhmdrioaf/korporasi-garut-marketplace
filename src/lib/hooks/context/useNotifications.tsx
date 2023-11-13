"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TNotificationContext } from "./notificationContext";
import useSWR from "swr";
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
    const [notification, setNotification] = useState<TNotification | null>(null)

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
        try {
            const updatedNotification = await readNotification(body);
            if (updatedNotification) {
                setNotification(updatedNotification);
                await mutate("/api/notifications/get");
            }
        } catch (error) {
            console.error(error);          
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
        toggleOpen();
    }

    const value: TNotificationContext = {
        data: {
            notification: notification
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

    useEffect(() => {
        if (notificationsData) {
            setNotification(notificationsData.result)
        }
    
    }, [notificationsData])

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}