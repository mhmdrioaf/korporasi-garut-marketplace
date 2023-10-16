import { PrismaClient } from "@prisma/client";
import {
  permissionHelper,
  properizeWords,
  variantIdGenerator,
  variantItemsIdGenerator,
} from "../helper";
import { db } from "../db";
import { TProductVariant } from "../globals";
import supabase from "../supabase";

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
  id: string;
  tags: string[];
}

interface IProductUpdateData extends IProductData {
  id: string;
}

interface IProductVariantUpdate {
  product_id: string;
  variant: Omit<TProductVariant, "product_id" | "product">[];
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
    const productVariants = this.prismaProductVariant!.aggregate({
      where: {
        product_id: {
          equals: parseInt(data.id),
        },
      },
      _max: {
        variant_id: true,
      },
    });

    const productVariantItems = this.prismaProductVariantItems!.aggregate({
      where: {
        variant: {
          product_id: {
            equals: parseInt(data.id),
          },
        },
      },
      _max: {
        variant_item_id: true,
      },
    });

    const [maxVariants, maxVariantItems] = await Promise.all([
      productVariants,
      productVariantItems,
    ]);

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
            parseInt(data.id),
            variantItemId + (index + 1)
          ),
          variant_name: properizeWords(items.variant_name),
          variant_value: items.variant_value,
          variant_price: items.variant_price,
        }))
      : [];

    const variants = data.variant
      ? data.variant.map((variant, index) => ({
          variant_id: variantIdGenerator(
            parseInt(data.id),
            variantId + (index + 1)
          ),
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
        id: parseInt(data.id),
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
        category_id:
          data.category_id === "noCategory" || data.category_id === ""
            ? null
            : data.category_id,
        tags: data.tags,
      },
    });
  }

  async listProduct() {
    const products = this.prismaProduct.findMany({
      include: {
        variant: {
          include: {
            variant_item: true,
          },
        },
        seller: true,
      },
    });

    const maxProductId = this.prismaProduct.aggregate({
      _max: {
        id: true,
      },
    });

    const [productsResult, maxIdResult] = await Promise.all([
      products,
      maxProductId,
    ]);

    const returnValue = {
      products: productsResult,
      maxId: maxIdResult._max.id ?? 0,
    };

    return returnValue;
  }

  async listSellerProduct(seller_id: string) {
    return await this.prismaProduct.findMany({
      where: {
        seller_id: {
          equals: parseInt(seller_id),
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

  async getProductDetail(id: string) {
    return await this.prismaProduct.findFirst({
      where: {
        id: {
          equals: parseInt(id),
        },
      },
      include: {
        seller: {
          select: {
            address: {
              include: {
                city: true,
              },
            },
            phone_number: true,
            user_id: true,
            account: {
              select: {
                profile_picture: true,
                user_name: true,
              },
            },
          },
        },
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
        tags: data.tags,
      },
    });
  }

  async productVariantUpdate(data: IProductVariantUpdate) {
    const upsertVariantItems = (
      variant: Omit<TProductVariant, "product_id" | "product">
    ) => {
      const variantItems = variant.variant_item;

      return variantItems.map((item, index) => ({
        where: {
          variant_item_id: item.variant_item_id,
        },
        create: {
          variant_item_id: item.variant_item_id,
          variant_name: item.variant_name,
          variant_value: item.variant_value,
          variant_price: item.variant_price,
        },
        update: {
          variant_name: item.variant_name,
          variant_price: item.variant_price,
          variant_value: item.variant_value,
        },
      }));
    };

    return await db.$transaction(
      data.variant.map((variant) =>
        db.product_variant.upsert({
          where: {
            variant_id: variant.variant_id,
          },
          create: {
            variant_id: variant.variant_id,
            variant_title: variant.variant_title,
            variant_item: {
              createMany: {
                data: variant.variant_item.map((item) => ({
                  variant_item_id: item.variant_item_id,
                  variant_name: item.variant_name,
                  variant_price: item.variant_price,
                  variant_value: item.variant_value,
                })),
                skipDuplicates: true,
              },
            },
            product_id: parseInt(data.product_id),
          },
          update: {
            variant_title: variant.variant_title,
            variant_item: {
              upsert: upsertVariantItems(variant),
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

  async getVariantDetail(product_id: string) {
    const _maxVariantItemId = this.prismaProductVariantItems?.aggregate({
      where: {
        variant: {
          product_id: {
            equals: parseInt(product_id),
          },
        },
      },
      _max: {
        variant_item_id: true,
      },
    });

    const _maxVariantId = this.prismaProductVariant?.aggregate({
      _max: {
        variant_id: true,
      },
    });

    const [maxVariantItemIdData, maxVariantIdData] = await Promise.all([
      _maxVariantItemId,
      _maxVariantId,
    ]);
    const variantItemId = maxVariantItemIdData?._max.variant_item_id;
    const variantId = maxVariantIdData?._max.variant_id;
    const maxVariantItemId = Number(
      variantItemId?.slice(variantItemId.length - 3, variantItemId.length) ?? 0
    );
    const maxVariantId = Number(
      variantId?.slice(variantId.length - 3, variantId.length) ?? 0
    );

    const returnValues = {
      maxVariantItem: maxVariantItemId,
      maxVariant: maxVariantId,
    };

    return returnValues;
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
    const { data: imageList } = await supabase.storage
      .from("products")
      .list(`PROD-${id}`);
    if (imageList) {
      const filesToRemove = imageList.map((x) => `PROD-${id}/${x.name}`);
      const { error } = await supabase.storage
        .from("products")
        .remove(filesToRemove);
      if (error) {
        console.error(
          "An error occurred when deleting product images: ",
          error
        );
      }
    }

    return await this.prismaProduct.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  async searchProducts(query: string) {
    const productsQuerySearch = await this.prismaProduct.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        variant: {
          include: {
            variant_item: true,
          },
        },
        seller: true,
      },
    });

    if (productsQuerySearch.length < 1) {
      return await db.$queryRaw`
        SELECT * FROM product
        WHERE EXISTS (
        SELECT FROM unnest(tags) tags
        WHERE tags LIKE ${`%${query}%`}
     )`;
    } else {
      return productsQuerySearch;
    }
  }

  async chageProductStatus(
    status: "APPROVED" | "REJECTED",
    token: string,
    productId: string
  ) {
    if (permissionHelper(token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)) {
      return await this.prismaProduct.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          status: status,
        },
      });
    } else {
      return null;
    }
  }
}
