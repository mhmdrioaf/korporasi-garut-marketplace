"use client";

import { useState } from "react";
import { Button } from "./button";
import { XIcon } from "lucide-react";

export default function AdminDashboardWarning() {
  const [isWarning, setIsWarning] = useState<boolean>(true);

  const onClose = () => {
    setIsWarning(false);
  };

  return isWarning ? (
    <div className="w-full bg-primary text-primary-foreground rounded-t-md px-4 py-2 flex flex-row lg:hidden items-center justify-between fixed bottom-0 left-0 z-50">
      <p className="text-xs lg:text-sm">
        Harap gunakan komputer/laptop untuk dapat melihat halaman{" "}
        <b>dashboard</b> dengan baik.
      </p>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <XIcon className="w-4 h-4" />
      </Button>
    </div>
  ) : null;
}
