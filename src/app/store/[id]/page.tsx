import { Container } from "@/components/ui/container";
import StoreProfileComponent from "@/components/ui/store-profile";

async function getSellerProfile(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_STORE_GET_PROFILE! + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();
  if (!response.ok) {
    return null;
  } else {
    return response.result as TSellerProfile;
  }
}

export default async function SellerStorePage({
  params,
}: {
  params: { id: string };
}) {
  const seller = await getSellerProfile(params.id);

  if (!seller) {
    return (
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <h1 className="text-2xl font-bold">Seller not found</h1>
        <p className="text-lg">
          The seller you are looking for does not exist.
        </p>
      </div>
    );
  } else {
    return (
      <Container>
        <StoreProfileComponent store={seller} />
      </Container>
    );
  }
}
