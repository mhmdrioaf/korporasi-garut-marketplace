"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { headers } from "next/headers";

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

export async function getReferrer(_prevState: any, data: FormData) {
  const referrer_id = data.get("referrer_id") as string;
  try {
    const referrer = await db.referrer.findUnique({
      where: {
        referrer_id: referrer_id,
      },
      include: {
        user: {
          select: {
            user_id: true,
            account: {
              select: {
                user_name: true,
              },
            },
          },
        },
      },
    });

    if (referrer) {
      return {
        result: referrer as TReferrer,
        message: "",
      };
    } else {
      return {
        result: null,
        message: "ID Referral tidak terdaftar.",
      };
    }
  } catch (err) {
    console.error("An error occurred while getting referrer data: ", err);
    return {
      result: null,
      message: "Telah terjadi kesalahan pada sistem, silahkan coba lagi nanti.",
    };
  }
}

export async function createReferrer(
  user_id: number,
  referrer_id: string,
  _prevState: any,
  data: FormData
) {
  const product_id = data.get("product_id") as string;
  const baseURL = headers().get("host") || "";

  try {
    const currentReferrer = await db.referrer.findUnique({
      where: {
        referrer_id: referrer_id,
      },
      include: {
        user: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (
      currentReferrer &&
      currentReferrer.user &&
      currentReferrer.user.user_id !== user_id
    ) {
      return {
        url: "",
        message: "ID Referral telah terdaftar pada akun lain.",
      };
    } else {
      const connectReferrer = await db.referrer.update({
        where: {
          referrer_id: referrer_id,
        },
        data: {
          user: {
            connect: {
              user_id: user_id,
            },
          },
        },
      });

      if (connectReferrer) {
        revalidatePath("/", "layout");
        return {
          url: `${baseURL}/product/${product_id}?ref=${referrer_id}`,
          message: "",
        };
      } else {
        return {
          url: "",
          message:
            "Telah terjadi kesalahan pada sistem, silahkan coba lagi nanti.",
        };
      }
    }
  } catch (error) {
    console.error("An error occurred while creating a new referrer: ", error);
    return {
      url: "",
      message: "Telah terjadi kesalahan pada sistem, silahkan coba lagi nanti.",
    };
  }
}
