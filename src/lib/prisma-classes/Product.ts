import { PrismaClient } from "@prisma/client";
import {
  properizeWords,
  variantIdGenerator,
  variantItemsIdGenerator,
} from "../helper";

type TProductVariantInput = {
  variant_title: string;
};

type TProductVariantItemInput = {
  variant_name: string;
  variant_value: string;
  variant_price: number;
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
  variant_items: TProductVariantItemInput[] | null;
}

export default class Product {
  constructor(
    private readonly prismaProduct: PrismaClient["product"],
    private readonly prismaProductVariant:
      | PrismaClient["product_variant"]
      | null,
    private readonly prismaProductVariantItems:
      | PrismaClient["product_variant_item"]
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

    const productVariantItems = this.prismaProductVariantItems!.aggregate({
      _max: {
        variant_item_id: true,
      },
    });

    const [maxProduct, maxVariants, maxVariantItems] = await Promise.all([
      products,
      productVariants,
      productVariantItems,
    ]);

    const productId = maxProduct._max.id ? maxProduct._max.id + 1 : 1;
    const maxVariantId = maxVariants._max.variant_id;
    const variantId = Number(
      maxVariantId?.slice(maxVariantId.length - 3, maxVariantId.length) ?? 0
    );

    const maxVariantItemId = maxVariantItems._max.variant_item_id;
    const variantItemId = Number(
      maxVariantItemId?.slice(
        maxVariantItemId.length - 3,
        maxVariantItemId.length
      ) ?? 0
    );

    const variantItems = data.variant_items
      ? data.variant_items.map((items, index) => ({
          variant_item_id: variantItemsIdGenerator(
            productId,
            variantItemId + (index + 1)
          ),
          variant_name: properizeWords(items.variant_name),
          variant_value: items.variant_value,
          variant_price: items.variant_price,
        }))
      : [];

    const variants = data.variant
      ? data.variant.map((variant, index) => ({
          variant_id: variantIdGenerator(productId, variantId + (index + 1)),
          variant_title: variant.variant_title,
          variant_item: {
            createMany: {
              data: variantItems,
            },
          },
        }))
      : [];

    return await this.prismaProduct.create({
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
          create: variants,
        },
      },
    });
  }

  async listProduct() {
    return await this.prismaProduct.findMany({
      include: {
        seller: true,
        variant: {
          include: {
            variant_item: true,
          },
        },
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
        variant: {
          include: {
            variant_item: true,
          },
        },
      },
    });
  }
}
