import { PrismaClient } from "@prisma/client";
import { variantIdGenerator } from "../helper";

type TProductVariantInput = {
  variant_title: string;
  variant_price: number;
  variant_value: string;
};

interface IProductData {
  title: string;
  description: string;
  images: string[];
  price: number;
  unit: string;
  weight: number;
  stock: number;
  seller_id: string;
  variant: TProductVariantInput[] | null;
}

export default class Product {
  constructor(
    private readonly prismaProduct: PrismaClient["product"],
    private readonly prismaProductVariant:
      | PrismaClient["product_variant"]
      | null
  ) {}

  async addProduct(data: IProductData) {
    const products = this.prismaProduct.aggregate({
      _max: {
        id: true,
      },
    });

    const productVariants = this.prismaProductVariant!.aggregate({
      _max: {
        variant_id: true,
      },
    });

    const [maxProduct, maxVariants] = await Promise.all([
      products,
      productVariants,
    ]);

    const productId = maxProduct._max.id ? maxProduct._max.id + 1 : 1;
    const maxVariantId = maxVariants._max.variant_id;
    const variantId = Number(
      maxVariantId?.slice(maxVariantId.length - 3, maxVariantId.length) ?? 0
    );

    const variants = data.variant
      ? data.variant.map((variant, index) => ({
          variant_id: variantIdGenerator(productId, variantId + (index + 1)),
          variant_title: variant.variant_title,
          variant_price: variant.variant_price,
          variant_value: variant.variant_value,
        }))
      : [];

    return this.prismaProduct.create({
      data: {
        id: productId,
        description: data.description,
        price: data.price,
        seller_id: parseInt(data.seller_id),
        title: data.title,
        unit: data.unit,
        weight: data.weight,
        images: data.images,
        stock: data.stock,
        variant: {
          createMany: {
            data: variants,
          },
        },
      },
    });
  }

  async listProduct() {
    return await this.prismaProduct.findMany({
      include: {
        seller: true,
        variant: true,
      },
    });
  }

  async getProductDetail(id: string) {
    return await this.prismaProduct.findFirst({
      where: {
        id: {
          equals: parseInt(id),
        },
      },
      include: {
        seller: true,
        variant: true,
      },
    });
  }
}
