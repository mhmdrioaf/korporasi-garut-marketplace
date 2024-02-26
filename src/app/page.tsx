import Carousel from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";
import ProductsList from "@/components/ui/products-list";
import { listProducts } from "@/lib/api";
import { CarouselAssets } from "@/lib/constants";

export default async function Home() {
  const products = await listProducts();
  return (
    <Container variant="column">
      <Carousel className="h-96" assets={CarouselAssets} />

      {products && (
        <ProductsList
          products={products
            .filter((product) => product.status === "APPROVED")
            .filter((product) => new Date(product.expire_date) > new Date())}
        />
      )}

      {!products && (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      )}
    </Container>
  );
}
