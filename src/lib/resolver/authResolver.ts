"use client";

import { z } from "zod";

export const authSchema = z.object({
  username: z.string().optional(),
  email: z
    .string()
    .email({
      message: "Harap masukkan email yang valid.",
    })
    .optional(),
  password: z.string().min(8, {
    message: "Password harus lebih dari 8 karakter.",
  }),
});

export const registerSchema = z.object({
  name: z.string(),
  username: z.string().regex(new RegExp("^[A-Za-z0-9]+$"), {
    message:
      "Username hanya boleh mengandung huruf dan nomor saja dan tidak boleh mengandung spasi.",
  }),
  email: z.string().email({
    message: "Harap masukkan format email yang valid, seperti: contoh@mail.com",
  }),
  phone_number: z
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
  password: z.string().min(8, {
    message: "Password setidaknya harus berjumlah 8 karakter atau lebih.",
  }),
  password_confirmations: z.string().min(8, {
    message: "Password setidaknya harus berjumlah 8 karakter atau lebih.",
  }),
});
