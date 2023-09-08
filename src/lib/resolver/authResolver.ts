"use client";

import { z } from "zod";

export const authSchema = z.object({
  username: z.string().optional(),
  email: z
    .string()
    .email({
      message: "Harap masukan email yang valid.",
    })
    .optional(),
  password: z.string().min(8, {
    message: "Password harus lebih dari 8 karakter.",
  }),
});
