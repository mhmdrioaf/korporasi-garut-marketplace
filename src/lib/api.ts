import Xendit from "xendit-node";
import Carts from "./prisma-classes/Carts";
import { db } from "./db";
import { TCustomerCart } from "./globals";

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
