import { PrismaClient } from "@prisma/client";
import {
  convertStringToBoolean,
  permissionHelper,
  properizeWords,
  variantIdGenerator,
  variantItemsIdGenerator,
} from "../helper";
import { db } from "../db";
import supabase from "../supabase";
import { IProductInput } from "../hooks/context/productContextType";

type TProductVariantItemInput = {
  variant_name: string;
  variant_value: string;
  variant_price: number;
};

type TNewProductVariantInput = {
  variant_title: string;
  variant_item: TProductVariantItemInput[];
};

interface IProductData extends IProductInput {
  id: string;
  tags: string[];
}

interface IProductUpdateData extends IProductInput {
  id: string;
  tags: string[];
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
    const variantItems =
      data.variant && data.variant.variant_item.length > 0
        ? data.variant.variant_item.map((item) => ({
            variant_item_id: variantItemsIdGenerator(
              data.product.title,
              data.variant?.variant_title ?? "",
              item.variant_item_name
            ),
            variant_name: properizeWords(item.variant_item_name),
            variant_price: item.variant_item_price,
            variant_stock: item.variant_item_stock,
          }))
        : [];

    const variant =
      data.variant && data.variant.variant_item.length > 0
        ? {
            variant_id: variantIdGenerator(
              data.product.title,
              data.variant.variant_title
            ),
            variant_title: data.variant.variant_title,
            variant_item: {
              createMany: {
                data: variantItems,
              },
            },
          }
        : {};

    return await this.prismaProduct.create({
      data: {
        id: parseInt(data.id),
        description: data.product.description,
        price: data.product.price,
        seller_id: parseInt(data.product.seller_id),
        title: data.product.title,
        unit: data.product.unit,
        weight: data.product.weight,
        images: data.product.images,
        stock: data.product.stock,
        variant:
          data.variant && data.variant.variant_item.length > 0
            ? {
                create: {
                  variant_id: variant.variant_id ?? "",
                  variant_title: variant.variant_title ?? "",
                  variant_item: {
                    createMany: {
                      data: variantItems,
                    },
                  },
                },
              }
            : undefined,
        category_id: data.product.category_id ?? null,
        tags: data.tags,
        capable_out_of_town: convertStringToBoolean(
          `${data.product.capable_out_of_town}`
        ),
        expire_date: data.product.expire_date,
        storage_period: data.product.storage_period,
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
        seller: {
          include: {
            address: {
              include: {
                city: true,
              },
            },
            account: {
              select: {
                user_name: true,
              },
            },
          },
        },
        category: {
          select: {
            category_name: true,
          },
        },
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
            primary_address_id: true,
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

  async updateProduct(data: IProductData) {
    return await this.prismaProduct.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.product.title,
        description: data.product.description,
        price: data.product.price,
        images: data.product.images,
        stock: data.product.stock,
        unit: data.product.unit,
        weight: data.product.weight,
        category_id: data.product.category_id,
        tags: data.tags,
        capable_out_of_town: convertStringToBoolean(
          `${data.product.capable_out_of_town}`
        ),
        expire_date: data.product.expire_date,
        storage_period: data.product.storage_period,
      },
    });
  }

  async productVariantUpdate(data: IProductUpdateData) {
    const upsertVariantItems = () => {
      const variantItems = data.variant!.variant_item;

      return variantItems.map((item) => ({
        where: {
          variant_item_id: item.variant_item_id,
        },
        create: {
          variant_item_id: variantItemsIdGenerator(
            data.product.title,
            data.variant!.variant_title,
            item.variant_item_name
          ),
          variant_name: item.variant_item_name,
          variant_price: item.variant_item_price,
          variant_stock: item.variant_item_stock,
        },
        update: {
          variant_item_id: variantItemsIdGenerator(
            data.product.title,
            data.variant!.variant_title,
            item.variant_item_name
          ),
          variant_name: item.variant_item_name,
          variant_price: item.variant_item_price,
          variant_stock: item.variant_item_stock,
        },
      }));
    };

    return await db.product_variant.upsert({
      where: {
        variant_id: variantIdGenerator(
          data.product.title,
          data.variant!.variant_title
        ),
      },
      create: {
        variant_id: variantIdGenerator(
          data.product.title,
          data.variant!.variant_title
        ),
        variant_title: data.variant!.variant_title,
        variant_item: {
          createMany: {
            data: data.variant!.variant_item.map((item) => ({
              variant_item_id: variantItemsIdGenerator(
                data.product.title,
                data.variant!.variant_title,
                item.variant_item_name
              ),
              variant_name: item.variant_item_name,
              variant_price: item.variant_item_price,
              variant_stock: item.variant_item_stock,
            })),
          },
        },
        product_id: parseInt(data.id),
      },
      update: {
        variant_title: data.variant!.variant_title,
        variant_item: {
          upsert: upsertVariantItems(),
        },
      },
    });

    // return await db.$transaction(
    //   data.variant.map((variant) =>
    //     db.product_variant.upsert({
    //       where: {
    //         variant_id: variant.variant_id,
    //       },
    //       create: {
    //         variant_id: variant.variant_id,
    //         variant_title: variant.variant_title,
    //         variant_item: {
    //           createMany: {
    //             data: variant.variant_item.map((item) => ({
    //               variant_item_id: item.variant_item_id,
    //               variant_name: item.variant_name,
    //               variant_price: item.variant_price,
    //               variant_stock: item.variant_stock,
    //             })),
    //             skipDuplicates: true,
    //           },
    //         },
    //         product_id: parseInt(data.product_id),
    //       },
    //       update: {
    //         variant_title: variant.variant_title,
    //         variant_item: {
    //           upsert: upsertVariantItems(variant),
    //         },
    //       },
    //     })
    //   )
    // );
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
          {
            tags: {
              has: query,
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
        seller: {
          include: {
            address: {
              include: {
                city: true,
              },
            },
          },
        },
      },
    });

    return productsQuerySearch;

    // if (productsQuerySearch.length < 1) {
    //   return await db.$queryRaw`
    //     SELECT * FROM product
    //     WHERE EXISTS (
    //     SELECT FROM unnest(tags) tags
    //     WHERE tags LIKE ${`%${query}%`}
    //  )`;
    // } else {
    //   return productsQuerySearch;
    // }
  }

  async chageProductStatus(
    status: "APPROVED" | "REJECTED",
    token: string,
    productId: string,
    message: string | null
  ) {
    if (permissionHelper(token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)) {
      return await this.prismaProduct.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          status: status,
          message: message,
        },
        include: {
          seller: {
            select: {
              user_id: true,
            },
          },
        },
      });
    } else {
      return null;
    }
  }
}
