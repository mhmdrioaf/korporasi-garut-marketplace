"use client";

import { z } from "zod";

export const addressSchema = z.object({
  label: z.string(),
  city: z.string(),
  fullAddress: z.string(),
  recipientName: z.string(),
  recipientPhoneNumber: z
    .string()
    .startsWith("0", {
      message:
        "Harap masukkan nomor telepon yang benar. Nomor telepon di awali dengan '0'",
    })
    .regex(new RegExp("^[0-9]+$"), {
      message:
        "Harap masukkan nomor telepon yang benar. Nomor telepon di awali dengan '0'",
    })
    .min(10, {
      message:
        "Harap masukkan nomor telepon yang benar. Nomor telepon setidaknya harus berjumlah 10 karakter",
    }),
});
