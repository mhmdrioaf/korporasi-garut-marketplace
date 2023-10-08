import { TProduct } from "@/lib/globals";
import ProductCard from "./product-card";

async function listProdudcts() {
  const fetchProducts = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_LIST!, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const response = await fetchProducts.json();
  if (!response.ok) {
    return [];
  } else {
    return response.result.products as TProduct[];
  }
}

export default async function ProductsList() {
  const products = await listProdudcts();
  if (products.length > 0) {
    return (
      <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
        {products.map((product: TProduct) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="w-full grid place-items-center">
        <p className="text-sm">
          Untuk saat ini belum ada produk yang di unggah.
        </p>
      </div>
    );
  }
}
