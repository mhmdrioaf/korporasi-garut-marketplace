import { Prisma, PrismaClient } from "@prisma/client";
import {
  accountIdGenerator,
  capitalizeFirstWord,
  properizeWords,
} from "../helper";
import * as bcrypt from "bcrypt";

type Register = {
  phone_number: string;
  name: string;
  username: string;
  email: string;
  password: string;
};

type Login = {
  username: string;
  password: string;
};

export default class Users {
  constructor(private readonly prismaUser: PrismaClient["user"]) {}

  async register(data: Register) {
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

  async login(data: Login) {
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

  async updateUser(dataToChange: string, value: string, username: string) {
    const dataChanged =
      dataToChange === "name"
        ? "nama"
        : dataToChange === "username"
        ? "nama pengguna"
        : "nomor telepon";
    try {
      const updateUser = await this.prismaUser.update({
        where: {
          username: username,
        },
        data:
          dataToChange !== "name"
            ? {
                [dataToChange]: value,
              }
            : {
                account: {
                  update: {
                    user_name: value,
                  },
                },
              },
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
}