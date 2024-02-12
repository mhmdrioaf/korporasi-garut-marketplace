"use client";

import { createContext, useContext, useOptimistic, useState } from "react";
import {
  deleteAllNotificationsHandler,
  deleteNotificationHandler,
  readAllNotificationsHandler,
  readNotificationHandler,
} from "@/lib/actions/notification";
import { usePathname, useRouter } from "next/navigation";

export const NotificationContext = createContext<TNotificationContext | null>(
  null
);

export function useNotifications() {
  return useContext(NotificationContext) as TNotificationContext;
}

interface INotificationContextProviderProps {
  children: React.ReactNode;
  notification: TNotification | null;
}

export function NotificationContextProvider({
  children,
  notification,
}: INotificationContextProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [optimisticNotification, addNotification] = useOptimistic(notification);

  const router = useRouter();
  const pathname = usePathname();

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const readNotifications = async (body: {
    notification_id: string;
    notification_item_id: string;
  }) => {
    try {
      if (optimisticNotification) {
        let updatedNotification = {
          ...optimisticNotification,
          items: optimisticNotification.items.map((item) => {
            if (item.notification_item_id === body.notification_item_id) {
              return {
                ...item,
                status: "READ" as NOTIFICATION_STATUS,
              };
            }
            return item;
          }),
        };

        addNotification(updatedNotification);

        await readNotificationHandler({
          ...body,
          contextURL: pathname,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const actionButtonClick = async (body: {
    notification_id: string;
    notification_item_id: string;
    redirect_url: string;
  }) => {
    if (optimisticNotification) {
      let updatedNotification = {
        ...optimisticNotification,
        items: optimisticNotification.items.map((item) => {
          if (item.notification_item_id === body.notification_item_id) {
            return {
              ...item,
              status: "READ" as NOTIFICATION_STATUS,
              show_action_button: false,
            };
          }
          return item;
        }),
      };

      addNotification(updatedNotification);

      await readNotificationHandler({
        ...body,
        contextURL: pathname,
      });
    }
    router.push(body.redirect_url);
    toggleOpen();
  };

  const deleteNotification = async (body: {
    notification_id: string;
    notification_item_id: string;
  }) => {
    try {
      if (optimisticNotification) {
        let updatedNotification = {
          ...optimisticNotification,
          items: optimisticNotification.items.filter(
            (item) => item.notification_item_id !== body.notification_item_id
          ),
        };

        addNotification(updatedNotification);
        await deleteNotificationHandler({
          ...body,
          contextURL: pathname,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const readAllNotifications = async (body: { notification_id: string }) => {
    try {
      if (optimisticNotification) {
        let updatedNotification = {
          ...optimisticNotification,
          items: optimisticNotification.items.map((item) => {
            return {
              ...item,
              status: "READ" as NOTIFICATION_STATUS,
            };
          }),
        };

        addNotification(updatedNotification);
        await readAllNotificationsHandler({
          ...body,
          contextURL: pathname,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllNotifications = async (body: { notification_id: string }) => {
    try {
      if (optimisticNotification) {
        let updatedNotification = {
          ...optimisticNotification,
          items: [],
        };

        addNotification(updatedNotification);
        await deleteAllNotificationsHandler({
          ...body,
          contextURL: pathname,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value: TNotificationContext = {
    data: {
      notification: optimisticNotification,
    },
    state: {
      isOpen: isOpen,
    },
    handler: {
      toggleOpen: toggleOpen,
      read: readNotifications,
      actionButtonClick: actionButtonClick,
      delete: deleteNotification,
      readAll: readAllNotifications,
      deleteAll: deleteAllNotifications,
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
