import { Prisma, PrismaClient } from "@prisma/client";
import {
  accountIdGenerator,
  permissionHelper,
  capitalizeFirstWord,
  properizeWords,
} from "../helper";
import * as bcrypt from "bcrypt";
import supabase from "../supabase";

type TRegisterData = {
  phone_number: string;
  name: string;
  username: string;
  email: string;
  password: string;
  token: string;
  role?: "CUSTOMER" | "SELLER";
};

type TLoginData = {
  username: string;
  password: string;
};

export default class Users {
  constructor(private readonly prismaUser: PrismaClient["user"]) {}

  async register(data: TRegisterData) {
    const prismaUsers = this.prismaUser.aggregate({
      _max: {
        user_id: true,
      },
    });

    const maxIdValue = (await prismaUsers)._max.user_id;
    return await this.prismaUser.create({
      data: {
        user_id: maxIdValue ? maxIdValue + 1 : 1,
        email: data.email.toLowerCase(),
        password: await bcrypt.hash(data.password, 10),
        username: data.username.toLowerCase(),
        phone_number: data.phone_number,
        token: data.token,
        role: data.role ?? "CUSTOMER",
        account: {
          connectOrCreate: {
            where: {
              user_id: maxIdValue ? maxIdValue + 1 : 1,
            },
            create: {
              account_id: accountIdGenerator(maxIdValue ? maxIdValue + 1 : 1),
              user_name: properizeWords(data.name),
            },
          },
        },
      },
    });
  }

  async getUserDetail(id: string) {
    const userDetail = await this.prismaUser.findFirst({
      where: {
        user_id: {
          equals: parseInt(id),
        },
      },
      select: {
        account: true,
        email: true,
        phone_number: true,
        user_id: true,
        username: true,
        role: true,
      },
    });

    return userDetail;
  }

  async login(data: TLoginData) {
    const user = await this.prismaUser.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: data.username.toLowerCase(),
            },
          },
          {
            email: {
              equals: data.username.toLowerCase(),
            },
          },
        ],
      },
    });

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (passwordMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async updateUser(dataToChange: string, value: string | null, userId: string) {
    const dataChanged =
      dataToChange === "name"
        ? "nama"
        : dataToChange === "username"
        ? "nama pengguna"
        : dataToChange === "phone_number"
        ? "nomor telepon"
        : dataToChange === "profile_picture"
        ? "foto profil"
        : "alamat utama";
    try {
      const updateUser = await this.prismaUser.update({
        where: {
          user_id: parseInt(userId),
        },
        data:
          dataToChange === "name"
            ? {
                account: {
                  update: {
                    user_name: value!,
                  },
                },
              }
            : dataToChange === "profile_picture"
            ? {
                account: {
                  update: {
                    profile_picture: value,
                  },
                },
              }
            : {
                [dataToChange]: value,
              },
        // dataToChange !== "name"
        //   ? {
        //       [dataToChange]: value,
        //     }
        //   : {
        //       account: {
        //         update: {
        //           user_name: value,
        //         },
        //       },
        //     },
      });

      if (updateUser) {
        return {
          status: "success",
          message: `Berhasil mengubah data ${dataChanged}`,
        };
      } else {
        return {
          status: "failed",
          message: `Gagal mengubah informasi ${dataChanged}, silahkan coba lagi nanti.`,
        };
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return {
            status: "failed",
            message: `${capitalizeFirstWord(dataChanged)} telah terdaftar.`,
          };
        } else {
          return {
            status: "failed",
            message:
              "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
          };
        }
      } else {
        return {
          status: "failed",
          message:
            "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
        };
      }
    }
  }

  async deleteUser(username: string) {
    const user = await this.prismaUser.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
      include: {
        products: true,
        account: true,
      },
    });

    if (user) {
      if (user.account?.profile_picture) {
        const profilePictureDelete = await supabase.storage
          .from("users")
          .remove([`${username}/profile-picture.jpg`]);
        if (profilePictureDelete.error) {
          console.error(
            "An error occurred while deleting user profile picture",
            profilePictureDelete.error
          );
          return {
            status: "failed",
            message:
              "Telah terjadi kesalahan ketika menghapus foto profil user.",
          };
        }
      }

      if (user.products.length > 0) {
        user.products.forEach(async (product) => {
          const { data: productImageLists } = await supabase.storage
            .from("products")
            .list(`PROD-${product.id}`);
          if (productImageLists) {
            const imagesToRemove = productImageLists.map(
              (file) => `PROD-${product.id}/${file.name}`
            );
            const { error: productImagesDeleteError } = await supabase.storage
              .from("products")
              .remove(imagesToRemove);
            if (productImagesDeleteError) {
              console.error(
                "An error occurred while deleting user product images: ",
                productImagesDeleteError
              );
              return {
                status: "failed",
                message: "Gagal menghapus foto-foto produk user.",
              };
            }
          }
        });
      }

      const deleteUser = await this.prismaUser.delete({
        where: {
          username: username,
        },
      });

      if (deleteUser) {
        return {
          status: "success",
          message: "Berhasil menghapus user.",
        };
      } else {
        return {
          status: "failed",
          message: "Telah terjadi kesalahan ketika menghapus data user.",
        };
      }
    } else {
      return {
        status: "failed",
        message: `User dengan nama pengguna ${username} tidak ditemukan.`,
      };
    }
  }

  async listUser(token: string) {
    if (permissionHelper(token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)) {
      return await this.prismaUser.findMany({
        include: {
          account: true,
          address: true,
          orders: true,
          products: true,
        },
        orderBy: {
          role: "asc",
        },
      });
    } else {
      return null;
    }
  }
}
