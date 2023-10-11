import { db } from "@/lib/db";
import { permissionHelper } from "@/lib/helper";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IProductStatusUpdateBody {
  productId: string;
  status: "APPROVED" | "REJECTED";
}

async function handler(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const body: IProductStatusUpdateBody = await request.json();

  if (
    authorization &&
    permissionHelper(authorization, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)
  ) {
    try {
      const products = new Product(db.product, null, null);
      const updateProductStatus = await products.chageProductStatus(
        body.status,
        authorization,
        body.productId
      );
      if (updateProductStatus) {
        return NextResponse.json({
          ok: true,
          message:
            "Status produk telah berhasil di ubah, silahkan muat ulang halaman untuk melihat perubahannya.",
        });
      } else {
        return NextResponse.json({
          ok: false,
          message:
            "Terjadi kesalahan ketika mengubah status produk, silahkan coba lagi nanti atau hubungi developer jika masalah berlanjut.",
        });
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json({
        ok: false,
        message:
          "Terjadi kesalahan ketika mengubah status produk, silahkan coba lagi nanti atau hubungi developer jika masalah berlanjut.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "Anda tidak mempunyai akses untuk melakukan permintaan ini!",
    });
  }
}

export { handler as PATCH };
