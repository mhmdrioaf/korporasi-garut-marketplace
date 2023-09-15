import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen grid place-items-center gap-2">
      <Loader2Icon className="w-16 h-16 animate-spin" />
    </div>
  );
}
