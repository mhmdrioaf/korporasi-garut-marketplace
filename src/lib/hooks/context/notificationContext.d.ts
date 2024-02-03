import { TNotification } from "@/lib/globals";

type TNotificationContext = {
  data: {
    notification: TNotification | null;
  };
  state: {
    isOpen: boolean;
  };
  handler: {
    toggleOpen: () => void;
    read: (body: {
      notification_id: string;
      notification_item_id: string;
    }) => Promise<void>;
    actionButtonClick: (body: {
      notification_id: string;
      notification_item_id: string;
      redirect_url: string;
    }) => Promise<void>;
    delete: (body: {
      notification_id: string;
      notification_item_id: string;
    }) => Promise<void>;
    readAll: (body: { notification_id: string }) => Promise<void>;
    deleteAll: (body: { notification_id: string }) => Promise<void>;
  };
};
