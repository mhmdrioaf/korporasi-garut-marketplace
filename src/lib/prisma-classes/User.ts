import { PrismaClient, user } from "@prisma/client";
import { properizeWords } from "../helper";
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
    return this.prismaUser.create({
      data: {
        email: data.email.toLowerCase(),
        name: properizeWords(data.name),
        password: await bcrypt.hash(data.password, 10),
        username: data.username.toLowerCase(),
        phone_number: data.phone_number,
      },
    });
  }

  async getUserDetail(user_id: string): Promise<user | null> {
    return this.prismaUser.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    });
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

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }
}
