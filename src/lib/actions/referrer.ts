"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";

export async function addReferrer(data: FormData) {
  const referral_id = data.get("referral_id") as string;

  try {
    const newReferrer = await db.referrer.create({
      data: {
        referrer_id: referral_id,
      },
    });

    if (newReferrer) {
      revalidatePath("/admin", "layout");
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
      };
    }
  } catch (error) {
    console.error("An error occurred while adding a new referrer: ", error);
    return {
      ok: false,
    };
  }
}

export async function deleteReferrer(referral_id: string) {
  try {
    await db.referrer.delete({
      where: {
        referrer_id: referral_id,
      },
    });

    revalidatePath("/admin", "layout");
    return {
      ok: true,
    };
  } catch (error) {
    console.error("An error occurred while deleting a referrer: ", error);
    return {
      ok: false,
    };
  }
}
