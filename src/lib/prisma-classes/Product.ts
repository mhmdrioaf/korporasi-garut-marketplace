import { PrismaClient } from "@prisma/client";
import {
  properizeWords,
  variantIdGenerator,
  variantItemsIdGenerator,
} from "../helper";
import { db } from "../db";
import { TProductVariant } from "../globals";

type TProductVariantInput = {
  variant_title: string;
};

type TProductVariantItemInput = {
  variant_name: string;
  variant_value: string;
  variant_price: number;
};

type TNewProductVariantInput = {
  variant_title: string;
  variant_item: TProductVariantItemInput[];
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
  category_id: string | null;
}

interface IProductUpdateData extends IProductData {
  id: string;
}

interface IProductVariantUpdate {
  product_id: string;
  variant: TProductVariant[];
}

export interface IAddProductVariant {
  product_id: string;
  variant: TNewProductVariantInput;
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
        category_id: data.category_id,
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

  async updateProduct(data: IProductUpdateData) {
    return await this.prismaProduct.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images,
        stock: data.stock,
        unit: data.unit,
        weight: data.weight,
        category_id: data.category_id,
      },
    });
  }

  async productVariantUpdate(data: IProductVariantUpdate) {
    const variantItems = data.variant.flatMap(
      (variant) => variant.variant_item
    );
    const upsertVariantItems = variantItems.map((item, index) => {
      const currentVariantItemsId = (id: string) =>
        Number(id.length > 0 ? id.slice(id.length - 3, id.length) : index + 1);

      return {
        where: {
          variant_item_id: variantItemsIdGenerator(
            parseInt(data.product_id),
            currentVariantItemsId(item.variant_item_id)
          ),
        },
        create: {
          variant_item_id: variantItemsIdGenerator(
            parseInt(data.product_id),
            currentVariantItemsId(item.variant_item_id)
          ),
          variant_name: item.variant_name,
          variant_value: item.variant_value,
          variant_price: item.variant_price,
        },
        update: {
          variant_name: item.variant_name,
          variant_price: item.variant_price,
          variant_value: item.variant_value,
        },
      };
    });

    // const createNewVariant = data.variant.map((variant, index) => {
    //   const currentVariantId = (id: string) =>
    //     Number(id.length > 0 ? id.slice(id.length - 3, id.length) : index + 1);

    //   return {
    //     where: {
    //       variant_id: variantIdGenerator(parseInt(data.product_id), currentVariantId(variant.variant_id)),
    //     },
    //     create: {
    //       variant_id: variantIdGenerator(parseInt(data.product_id), currentVariantId(variant.variant_id)),
    //       variant_title: properizeWords(variant.variant_title),
    //       variant_item: variant.variant_item
    //     },
    //     update: {
    //       variant_title: variant.variant_title,
    //       variant_item: {
    //         upsert: upsertVariantItems
    //       }
    //     },
    //   }
    // })

    return await db.$transaction(
      data.variant.map((variant) =>
        db.product_variant.update({
          where: {
            variant_id: variant.variant_id,
          },
          data: {
            variant_title: variant.variant_title,
            variant_item: {
              upsert: upsertVariantItems,
            },
          },
        })
      )
    );
  }

  async addProductVariant(data: IAddProductVariant) {
    const getMaxVariants = await this.prismaProductVariant?.aggregate({
      where: {
        product_id: {
          equals: parseInt(data.product_id),
        },
      },
      _max: {
        variant_id: true,
      },
    });

    const maxVariants = getMaxVariants?._max.variant_id;
    const maxVariantsId = Number(
      maxVariants?.slice(maxVariants.length - 3, maxVariants.length) ?? 0
    );

    const createManyVariantsItem = data.variant.variant_item.map(
      (item, index) => ({
        variant_item_id: variantItemsIdGenerator(
          parseInt(data.product_id),
          index + 1
        ),
        variant_name: item.variant_name,
        variant_price: item.variant_price,
        variant_value: item.variant_value,
      })
    );

    return await this.prismaProductVariant?.create({
      data: {
        variant_id: variantIdGenerator(
          parseInt(data.product_id),
          maxVariantsId + 1
        ),
        variant_title: data.variant.variant_title,
        variant_item: {
          createMany: {
            data: createManyVariantsItem,
          },
        },
      },
    });
  }

  async deleteProductVariant(id: string) {
    return await this.prismaProductVariant?.delete({
      where: {
        variant_id: id,
      },
    });
  }

  async deleteProductVariantItems(id: string) {
    return await this.prismaProductVariantItems?.delete({
      where: {
        variant_item_id: id,
      },
    });
  }

  async deleteProduct(id: string) {
    return await this.prismaProduct.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
