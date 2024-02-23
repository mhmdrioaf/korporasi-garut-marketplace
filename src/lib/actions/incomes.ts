"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";

export async function payIncome(income_id: string) {
  try {
    const updateIncome = await db.income.update({
      where: {
        income_id: income_id,
      },
      data: {
        income_status: "PAID",
      },
      include: {
        seller: {
          select: {
            account: {
              select: {
                user_name: true,
              },
            },
          },
        },
        order: {
          select: {
            order_item: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (updateIncome) {
      revalidatePath("/admin/reports");
      return {
        ok: true,
        result: updateIncome as unknown as TIncome,
      };
    } else {
      return {
        ok: false,
        result: null,
      };
    }
  } catch (error) {
    console.error("An error occurred when updating income status: ", error);
    return {
      ok: false,
      result: null,
    };
  }
}

export async function payAllIncomes(income_ids: string[]) {
  try {
    const updateAll = await db.income.updateMany({
      where: {
        income_id: {
          in: income_ids,
        },
      },
      data: {
        income_status: "PAID",
      },
    });

    if (updateAll) {
      revalidatePath("/admin/reports");

      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
      };
    }
  } catch (error) {
    console.error(
      "An error occurred when updating all incomes status: ",
      error
    );
    return {
      ok: false,
    };
  }
}
