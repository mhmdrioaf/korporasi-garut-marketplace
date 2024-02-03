import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PaymentLoading() {
  return (
    <Dialog open>
      <DialogContent>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <div className="w-40 h-6 rounded-sm bg-gray-200 animate-pulse" />
            <div className="w-28 h-4 rounded-sm bg-gray-200 animate-pulse" />
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-6 rounded-sm bg-gray-200 animate-pulse" />
            <div className="w-full h-4 rounded-sm bg-gray-200 animate-pulse" />
            <div className="w-[calc(100%-4rem)] h-4 rounded-sm bg-gray-200 animate-pulse" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
