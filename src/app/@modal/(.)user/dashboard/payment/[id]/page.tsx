import PaymentProofModal from "@/components/ui/modals/payment-proof";
import { getInvoice } from "@/lib/api";

export default async function PaymentProofPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  return invoice ? (
    <PaymentProofModal invoice={invoice} isOpen={true} />
  ) : (
    <div>Invoice not found</div>
  );
}
