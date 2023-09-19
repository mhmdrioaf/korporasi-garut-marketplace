import { ROUTES } from "@/lib/constants";
import { IProduct } from "@/lib/globals";
import { rupiahConverter } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: IProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={ROUTES.PRODUCT.DETAIL(product.id.toString())}
      className="w-full border border-stone-200 p-2 min-h-full max-h-96 overflow-hidden flex flex-col gap-2 rounded-lg"
    >
      <div className="w-full h-32 bg-stone-200 shrink-0 rounded-md overflow-hidden relative">
        <Image
          src={product.images[0]}
          alt={product.title + " picture"}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <p
          title={product.title}
          className="text-xs md:text-base self-start md:self-center font-medium w-[25ch] md:w-fit overflow-hidden overflow-ellipsis"
        >
          {product.title}
        </p>
        <p className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {product.descriptions}
        </p>

        <div className="w-full items-center flex flex-row gap-2 justify-evenly md:justify-center">
          <p className="text-xs font-medium line-through text-red-950">
            Rp. 25.000,.
          </p>
          <p className="text-sm font-bold text-green-950">
            {rupiahConverter(product.price)}
          </p>
        </div>

        <div className="hidden w-full md:flex items-center justify-between gap-2">
          <div className="w-full px-2 py-1 bg-green-950 rounded-md text-white grid place-items-center">
            <p className="text-sm">Bandung</p>
          </div>

          <div className="w-full px-2 py-1 bg-gray-950 rounded-md text-white grid place-items-center">
            <p className="text-sm">Hortikultura</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-evenly gap-4">
          <p className="text-sm text-stone-500">50+</p>
          <div className="w-px h-5 bg-stone-500" />
          <p className="text-sm text-stone-500">4.5</p>
        </div>
      </div>
    </Link>
  );
}
