"use server";

import { revalidatePath } from "next/cache";

export async function reject({
  product_id,
  message,
  token,
}: {
  product_id: number;
  message: string;
  token: string;
}) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_STATUS_UPDATE!, {
    method: "PATCH",
    headers: { authorization: token },
    body: JSON.stringify({
      productId: product_id,
      status: "REJECTED",
      message: message,
    }),
  });

  const response = await res.json();
  revalidatePath("/admin/product-management");
  if (!response.ok) {
    return {
      status: "destructive",
      message: response.message,
    };
  } else {
    return {
      status: "success",
      message: response.message,
    };
  }
}
