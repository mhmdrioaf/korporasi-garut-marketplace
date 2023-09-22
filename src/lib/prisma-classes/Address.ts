import { PrismaClient } from "@prisma/client";
import {
  addressIdGenerator,
  phoneNumberGenerator,
  properizeWords,
} from "../helper";

type TAddAddress = {
  user_id: string;
  city: string;
  fullAddress: string;
  recipientName: string;
  recipientPhoneNumber: string;
  label: string;
};

export default class Address {
  constructor(
    private readonly prismaAddress: PrismaClient["address"] | null,
    private readonly prismaUser: PrismaClient["user"] | null
  ) {}

  async addAddress(data: TAddAddress) {
    const userAddresses = await this.prismaAddress?.aggregate({
      _max: {
        address_id: true,
      },
      where: {
        user_id: {
          equals: parseInt(data.user_id),
        },
      },
    });

    const maxIdValue = userAddresses?._max.address_id;
    const maxValue = Number(
      maxIdValue?.slice(maxIdValue.length - 3, maxIdValue.length)
    );

    const createNewAddress = this.prismaUser?.update({
      where: {
        user_id: parseInt(data.user_id),
      },
      data: {
        address: {
          connectOrCreate: {
            where: {
              address_id: addressIdGenerator(
                maxValue ? maxValue + 1 : 1,
                data.user_id
              ),
            },
            create: {
              address_id: addressIdGenerator(
                maxValue ? maxValue + 1 : 1,
                data.user_id
              ),
              city: properizeWords(data.city),
              full_address: data.fullAddress,
              recipient_name: properizeWords(data.recipientName),
              recipient_phone_number: phoneNumberGenerator(
                data.recipientPhoneNumber
              ),
              label: properizeWords(data.label),
            },
          },
        },
      },
    });

    const updatePrimaryAddress = isNaN(maxValue)
      ? this.prismaUser?.update({
          where: {
            user_id: parseInt(data.user_id),
          },
          data: {
            primary_address_id: addressIdGenerator(1, data.user_id),
          },
        })
      : false;

    return await Promise.all([createNewAddress, updatePrimaryAddress]);
  }

  async listAddresses(user_id: string) {
    return this.prismaUser?.findFirst({
      where: {
        user_id: {
          equals: parseInt(user_id),
        },
      },
      select: {
        primary_address_id: true,
        address: true,
      },
      orderBy: {
        primary_address_id: {
          sort: "desc",
          nulls: "last",
        },
      },
    });
  }

  async updateAddress(data: TAddAddress & { address_id: string }) {
    return await this.prismaAddress?.update({
      where: {
        address_id: data.address_id,
      },
      data: {
        city: properizeWords(data.city),
        full_address: data.fullAddress,
        label: properizeWords(data.label),
        recipient_name: properizeWords(data.recipientName),
        recipient_phone_number: phoneNumberGenerator(data.recipientPhoneNumber),
      },
    });
  }

  async deleteAddress(addressId: string) {
    return await this.prismaAddress?.delete({
      where: {
        address_id: addressId,
      },
    });
  }
}
