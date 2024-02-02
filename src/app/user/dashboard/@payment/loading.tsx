import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";

export default function PaymentLoading() {
  return (
    <Dialog open>
      <DialogContent>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <div className="w-40 h-6 rounded-sm bg-gray-200 animate-pulse" />
            <div className="w-28 h-4 rounded-sm bg-gray-200 animate-pulse" />
          </div>

          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <Loader2Icon className="w-12 h-12 animate-spin" />
            <p className="text-sm">Memuat detail pembayaran....</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
