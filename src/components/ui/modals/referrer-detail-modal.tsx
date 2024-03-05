"use client";

import Modal from "../modal";

interface IReferrerDetailModalProps {
  referrer: TReferrer | null;
  onClose: () => void;
}

export default function ReferrerDetailModal({
  referrer,
  onClose,
}: IReferrerDetailModalProps) {
  return (
    <Modal defaultOpen onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary">Detail Referral</p>
          <p className="text-xs">
            Berikut merupakan data referral yang bersangkutan
          </p>
        </div>

        {referrer ? (
          <div className="w-full grid grid-cols-2">
            <div className="flex flex-col gap-1 text-sm">
              <b>ID Referral</b>
              <p>{referrer.referrer_id}</p>
            </div>
            {!referrer.user && (
              <div className="flex flex-col gap-1 text-sm">
                <b>User</b>
                <p>Belum dikaitkan</p>
              </div>
            )}

            {referrer.user && (
              <div className="flex flex-col gap-1 text-sm">
                <b>Nama Referrer</b>
                <p>{referrer.user.account.user_name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <p className="text-sm">Tidak ada data yang ditemukan</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
