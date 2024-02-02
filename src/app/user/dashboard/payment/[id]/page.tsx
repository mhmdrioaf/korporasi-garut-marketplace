import PaymentProofComponent from "@/components/ui/payment-proof-component";
import { getInvoice } from "@/lib/api";

export default async function PaymentProofPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  return invoice ? (
    <div className="w-full p-4 flex items-center justify-center">
      <div className="w-1/2 flex items-center justify-center p-2 rounded-md shadow-md self-center justify-self-center">
        <PaymentProofComponent invoice={invoice} />
      </div>
    </div>
  ) : (
    <div className="w-full p-4 flex items-center justify-center">
      <p className="text-xl text-primary">Invoice tidak ditemukan</p>
    </div>
  );
}
