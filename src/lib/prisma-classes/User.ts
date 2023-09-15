import { PrismaClient } from "@prisma/client";
import { accountIdGenerator, properizeWords } from "../helper";
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

  async getUserDetail(username: string) {
    const userDetail = await this.prismaUser.findFirst({
      where: {
        username: {
          equals: username,
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
}
