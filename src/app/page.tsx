import Carousel from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";
import ProductsList from "@/components/ui/products-list";
import { CarouselAssets } from "@/lib/constants";

export default function Home() {
  return (
    <Container variant="column">
      <Carousel className="h-96" assets={CarouselAssets} />
      <ProductsList />
      {/* TODO: Add sidebar containing product categories */}
    </Container>
  );
}
