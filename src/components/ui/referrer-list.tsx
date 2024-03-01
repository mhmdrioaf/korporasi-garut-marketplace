"use client";

import Link from "next/link";
import { Button } from "./button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { ROUTES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import ReferrerDeleteModal from "./modals/referrer-delete-modal";
import { useState } from "react";
import ReferrerDetailModal from "./modals/referrer-detail-modal";

export default function ReferrerLists({
  referrers,
}: {
  referrers: TReferrer[];
}) {
  const [refId, setRefId] = useState<string | null>(null);
  const [action, setAction] = useState<"DELETE" | "DETAIL" | null>(null);

  const onClose = () => {
    setRefId(null);
    setAction(null);
  };

  const onActionClick = (referral_id: string, action: "DELETE" | "DETAIL") => {
    setRefId(referral_id);
    setAction(action);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button variant="default" asChild className="self-end">
        <Link href={ROUTES.ADMIN.USER_MANAGEMENT.ADD_REFERRER}>
          Tambah Referrer
        </Link>
      </Button>
      <Table>
        <TableCaption>
          {referrers.length > 0
            ? "Daftar Referral"
            : "Tidak ada referral yang ditemukan"}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>ID Referral</TableHead>
            <TableHead>Telah dikaitkan dengan akun?</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {referrers.map((referrer, index) => (
            <TableRow key={index}>
              <TableCell>{referrer.referrer_id}</TableCell>
              <TableCell>{referrer.user ? "Ya" : "Tidak"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="default">
                      Aksi
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="px-4 py-2 grid place-items-center hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      onClick={() =>
                        onActionClick(referrer.referrer_id, "DETAIL")
                      }
                    >
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-4 py-2 grid place-items-center hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                      onClick={() =>
                        onActionClick(referrer.referrer_id, "DELETE")
                      }
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {action === "DELETE" && refId && (
        <ReferrerDeleteModal isOpen onClose={onClose} referral_id={refId} />
      )}

      {action === "DETAIL" && refId && (
        <ReferrerDetailModal
          referrer={referrers.find((ref) => ref.referrer_id === refId) ?? null}
          onClose={onClose}
        />
      )}
    </div>
  );
}
