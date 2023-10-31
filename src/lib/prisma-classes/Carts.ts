import { PrismaClient } from "@prisma/client";
import {
  calculateCartCosts,
  cartIdGenerator,
  cartItemIdGenerator,
} from "../helper";
import { TProduct, TProductVariantItem } from "../globals";

type TAddCart = {
  user_id: string;
  product: TProduct;
  product_variant: TProductVariantItem | null;
  product_quantity: number;
};

export default class Carts {
  constructor(
    private readonly prismaCarts: PrismaClient["customer_cart"],
    private readonly prismaCartItems: PrismaClient["customer_cart_item"]
  ) {}

  async initializeCart(data: TAddCart) {
    try {
      const _cart_id = cartIdGenerator(parseInt(data.user_id));

      const wholeItem = this.prismaCartItems.aggregate({
        where: {
          AND: [
            {
              cart_id: {
                equals: _cart_id,
              },
            },
            {
              product_id: {
                equals: data.product.id,
              },
            },
          ],
        },
        _max: {
          cart_item_id: true,
        },
      });

      const cartItem = this.prismaCartItems.aggregate({
        where: {
          AND: [
            {
              product_id: {
                equals: data.product.id,
              },
            },
            {
              product_variant_item_id: {
                equals: data.product_variant?.variant_item_id ?? null,
              },
            },
          ],
        },
        _max: {
          cart_item_id: true,
        },
      });

      const [whole_max_item, max_item] = await Promise.all([
        wholeItem,
        cartItem,
      ]);

      const whole_item_id = whole_max_item._max.cart_item_id;
      const whole_max_item_id = Number(
        whole_item_id?.slice(whole_item_id.length - 3, whole_item_id.length) ??
          0
      );
      const item_id = max_item._max.cart_item_id;
      const max_item_id = Number(
        item_id?.slice(item_id.length - 3, item_id.length) ?? 1
      );

      const createCart = await this.prismaCarts.upsert({
        where: {
          cart_id: _cart_id,
        },
        update: {
          total_price: {
            increment: calculateCartCosts(
              data.product.price,
              data.product_quantity,
              data.product_variant ? data.product_variant.variant_price : 0
            ),
          },
          total_weight: {
            increment: data.product.weight * data.product_quantity,
          },
          cart_items: {
            upsert: {
              where: {
                cart_id: _cart_id,
                product_id: data.product.id,
                product_variant_item_id: data.product_variant
                  ? data.product_variant.variant_item_id
                  : null,
                cart_item_id: cartItemIdGenerator(
                  parseInt(data.user_id),
                  data.product.title,
                  max_item_id
                ),
              },
              update: {
                quantity: {
                  increment: data.product_quantity,
                },
                product_variant_item_id: data.product_variant
                  ? data.product_variant.variant_item_id
                  : null,
              },
              create: {
                cart_item_id: cartItemIdGenerator(
                  parseInt(data.user_id),
                  data.product.title,
                  max_item_id + whole_max_item_id
                ),
                product_id: data.product.id,
                product_variant_item_id: data.product_variant?.variant_item_id,
                quantity: data.product_quantity,
              },
            },
          },
        },
        create: {
          cart_id: _cart_id,
          user_id: parseInt(data.user_id),
          total_price: calculateCartCosts(
            data.product.price,
            data.product_quantity,
            data.product_variant ? data.product_variant.variant_price : 0
          ),
          cart_items: {
            create: {
              cart_item_id: cartItemIdGenerator(
                parseInt(data.user_id),
                data.product.title,
                max_item_id
              ),
              product_id: data.product.id,
              product_variant_item_id: data.product_variant?.variant_item_id,
              quantity: data.product_quantity,
            },
          },
          total_weight: data.product.weight * data.product_quantity,
        },
      });

      if (createCart) {
        return {
          ok: true,
          message: "Berhasil menambahkan produk ke keranjang.",
        };
      } else {
        return {
          ok: false,
          message: "Terjadi kesalahan ketika menambahkan produk ke keranjang.",
        };
      }
    } catch (error) {
      console.error(
        "An error occurred while adding items to the cart: ",
        error
      );
      return {
        ok: false,
        message: "Terjadi kesalahan ketika menambahkan produk ke keranjang.",
      };
    }
  }

  async getCart(user_id: number) {
    return await this.prismaCarts.findFirst({
      where: {
        user_id: {
          equals: user_id,
        },
      },
      include: {
        cart_items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    address: {
                      select: {
                        city: true,
                        address_id: true,
                      },
                    },
                    account: {
                      select: {
                        user_name: true,
                      },
                    },
                    user_id: true,
                    primary_address_id: true,
                  },
                },
              },
            },
            variant: true,
          },
        },
      },
    });
  }
}
