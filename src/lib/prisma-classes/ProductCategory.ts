import { PrismaClient } from "@prisma/client";
import { productCategoryIdGenerator, properizeWords } from "../helper";

interface IUpdateCategoryInput {
  category_id: string;
  category_name: string;
}

export default class ProductCategory {
  constructor(
    private readonly prismaCategory: PrismaClient["product_category"]
  ) {}

  async getCategoryMaxId() {
    const categoryMaxId = await this.prismaCategory.aggregate({
      _max: {
        category_id: true,
      },
    });

    const maxId = categoryMaxId._max.category_id;
    const max = Number(maxId?.slice(maxId.length - 2, maxId.length) ?? 0);

    return max;
  }

  async addCategory(name: string) {
    const maxId = await this.getCategoryMaxId();
    return await this.prismaCategory.create({
      data: {
        category_id: productCategoryIdGenerator(maxId + 1),
        category_name: properizeWords(name),
      },
    });
  }

  async listCategory() {
    return await this.prismaCategory.findMany({
      include: {
        products: true,
      },
    });
  }

  async getCategoryDetail(id: string) {
    return await this.prismaCategory.findFirst({
      where: {
        category_id: {
          equals: id,
        },
      },
      include: {
        products: true,
      },
    });
  }

  async deleteCategory(id: string) {
    return this.prismaCategory.delete({
      where: {
        category_id: id,
      },
    });
  }

  async updateCategory(data: IUpdateCategoryInput) {
    return await this.prismaCategory.update({
      where: {
        category_id: data.category_id,
      },
      data: {
        category_name: properizeWords(data.category_name),
      },
    });
  }
}
