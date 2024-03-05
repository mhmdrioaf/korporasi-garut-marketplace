import Xendit from "xendit-node";
import Carts from "./prisma-classes/Carts";
import { db } from "./db";
import Product from "./prisma-classes/Product";
import Users from "./prisma-classes/User";
import { permissionHelper } from "./helper";

export async function getInvoice(invoice_id: string) {
  const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY!,
  });

  try {
    const invoice = await xendit.Invoice.getInvoiceById({
      invoiceId: invoice_id,
    });

    return invoice;
  } catch (error) {
    console.error("An error occurred while fetching invoice: ", error);
    return null;
  }
}

export async function getUserCart(user_id: number) {
  const carts = new Carts(db.customer_cart, db.customer_cart_item);

  const cart = await carts.getCart(user_id);

  return cart as TCustomerCart | null;
}

export async function listProducts() {
  const products = new Product(db.product, null, null);
  const listProducts = await products.listProduct();

  return listProducts.products as unknown as TProduct[] | null;
}

export async function getProductDetail(product_id: string) {
  const products = new Product(db.product, null, null);
  const product = await products.getProductDetail(product_id);

  if (product) {
    await db.product.update({
      where: {
        id: parseInt(product_id),
      },
      data: {
        visitor: {
          increment: 1,
        },
      },
    });

    return product as unknown as TProduct;
  } else {
    return null;
  }
}

export async function getUserDetail(user_id: string) {
  const users = new Users(db.user);
  const user = await users.getUserDetail(user_id);

  return user as TUser | null;
}

export async function getUserNotification(subscriber_id: string) {
  const userNotification = await db.notification.findUnique({
    where: {
      subscriber_id: parseInt(subscriber_id),
    },
    include: {
      items: {
        orderBy: {
          status: "asc",
        },
      },
    },
  });

  return userNotification as TNotification | null;
}

export async function getIncomes() {
  const incomes = await db.income.findMany({
    where: {
      order: {
        OR: [
          {
            order_status: {
              equals: "DELIVERED",
            },
          },
          {
            order_status: {
              equals: "FINISHED",
            },
          },
        ],
      },
    },
    include: {
      seller: {
        select: {
          account: {
            select: {
              user_name: true,
            },
          },
        },
      },
      order: {
        select: {
          order_item: {
            include: {
              product: true,
            },
          },
        },
      },
      referrer: {
        select: {
          user: {
            select: {
              account: {
                select: {
                  user_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return incomes as unknown as TIncome[];
}

export async function listReferrer(token: string) {
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;
  const isGranted = permissionHelper(token, adminToken);

  if (!isGranted) {
    return null;
  } else {
    const referrer = await db.referrer.findMany({
      include: {
        user: {
          select: {
            account: {
              select: {
                user_name: true,
              },
            },
          },
        },
      },
    });
    return referrer as TReferrer[];
  }
}
