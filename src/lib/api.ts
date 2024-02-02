import Xendit from "xendit-node";

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
