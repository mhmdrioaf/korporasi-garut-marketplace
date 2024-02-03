"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { TNotification } from "../globals";
import { ROUTES } from "../constants";

export async function readNotificationHandler(body: {
  notification_id: string;
  contextURL: string;
  notification_item_id: string;
}) {
  const readNotification = await db.notification.update({
    where: {
      notification_id: body.notification_id,
    },
    data: {
      items: {
        update: {
          where: {
            notification_item_id: body.notification_item_id,
          },
          data: {
            status: "READ",
            show_action_button: false,
          },
        },
      },
    },
    include: {
      items: {
        orderBy: {
          status: "asc",
        },
      },
    },
  });

  if (readNotification) {
    revalidatePath(body.contextURL);
    return readNotification as TNotification;
  } else {
    return undefined;
  }
}

export async function deleteNotificationHandler(body: {
  notification_id: string;
  contextURL: string;
  notification_item_id: string;
}) {
  const deleteNotification = await db.notification.update({
    where: {
      notification_id: body.notification_id,
    },
    data: {
      items: {
        delete: {
          notification_item_id: body.notification_item_id,
        },
      },
    },
    include: {
      items: {
        orderBy: {
          status: "asc",
        },
      },
    },
  });

  if (deleteNotification) {
    revalidatePath(body.contextURL);
    return deleteNotification as TNotification;
  } else {
    return undefined;
  }
}

export async function readAllNotificationsHandler(body: {
  notification_id: string;
  contextURL: string;
}) {
  const readAllNotifications = await db.notification.update({
    where: {
      notification_id: body.notification_id,
    },
    data: {
      items: {
        updateMany: {
          where: {
            status: "UNREAD",
          },
          data: {
            status: "READ",
          },
        },
      },
    },
    include: {
      items: {
        orderBy: {
          notifiedAt: "desc",
        },
      },
    },
  });

  if (readAllNotifications) {
    revalidatePath(body.contextURL);
    return readAllNotifications as TNotification;
  } else {
    return undefined;
  }
}

export async function deleteAllNotificationsHandler(body: {
  notification_id: string;
  contextURL: string;
}) {
  const deleteAllItems = await db.notification.update({
    where: {
      notification_id: body.notification_id,
    },
    data: {
      items: {
        deleteMany: {
          notification_id: body.notification_id,
        },
      },
    },
    include: {
      items: {
        orderBy: {
          notifiedAt: "desc",
        },
      },
    },
  });

  if (deleteAllItems) {
    revalidatePath(body.contextURL);
    return deleteAllItems as TNotification;
  } else {
    return undefined;
  }
}

export async function sendNotificationHandler(body: {
  subscriber_target: string;
  notification_title: string;
  notification_redirect_url: string;
}) {
  const sendNotification = await db.notification.upsert({
    where: {
      subscriber_id: parseInt(body.subscriber_target),
    },
    create: {
      subscriber_id: parseInt(body.subscriber_target),
      items: {
        create: {
          title: body.notification_title,
          redirect_url: body.notification_redirect_url,
        },
      },
    },
    update: {
      items: {
        create: {
          title: body.notification_title,
          redirect_url: body.notification_redirect_url,
        },
      },
    },
  });

  if (sendNotification) {
    revalidatePath(body.notification_redirect_url);
    return sendNotification as TNotification;
  } else {
    return undefined;
  }
}

export async function sendSellerNotificationHandler(body: {
  seller_id: string;
  order_id: string;
}) {
  const sendNotification = await db.notification.upsert({
    where: {
      subscriber_id: parseInt(body.seller_id),
    },
    create: {
      subscriber_id: parseInt(body.seller_id),
      items: {
        create: {
          title: `Pesanan baru dengan ID ${body.order_id} telah diterima.`,
          redirect_url: "/user/dashboard/seller-orders?state=PAID",
        },
      },
    },
    update: {
      items: {
        create: {
          title: `Pesanan baru dengan ID ${body.order_id} telah diterima.`,
          redirect_url: "/user/dashboard/seller-orders?state=PAID",
        },
      },
    },
  });

  if (sendNotification) {
    revalidatePath(ROUTES.USER.ORDERS_MANAGEMENT);
    return sendNotification as TNotification;
  } else {
    return undefined;
  }
}
