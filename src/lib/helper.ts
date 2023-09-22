import { TAddress, TProduct, ORDER_STATUS } from "./globals";

export const getAvatarInitial = (name: string): string => {
  const slicedName = name.split(" ");
  if (slicedName.length > 2) {
    return slicedName[0].charAt(0) + slicedName[1].charAt(0);
  } else if (slicedName.length === 1) {
    return slicedName[0].charAt(0);
  } else {
    return (
      slicedName[0].charAt(0) + slicedName[slicedName.length - 1].charAt(0)
    );
  }
};

export const capitalizeFirstWord = (message: string): string => {
  const firstWord = message.charAt(0).toUpperCase();
  const restWord = message.slice(1, message.length);

  return `${firstWord}${restWord}`;
};

export const properizeWords = (words: string): string => {
  const allWords = words.split(" ");
  let properized: string[] = [];
  allWords.forEach((word) => {
    const firstWord = word.charAt(0).toUpperCase();
    const restWords = word.slice(1, word.length).toLowerCase();
    properized.push(`${firstWord}${restWords}`);
  });

  return properized.join(" ");
};

export const getProductDetail = async (id: string) => {
  const fetchProduct = await fetch(
    process.env.NEXT_PUBLIC_API_PRODUCT_GET! + id,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const response = await fetchProduct.json();
  if (!response.ok) {
    return null;
  } else {
    return response.result as TProduct;
  }
};

const decimalsNumber = (value: number, approximateNumber: 10 | 100) => {
  switch (approximateNumber) {
    case 10:
      if (value < 10) {
        return `0${value}`;
      } else {
        return value.toString();
      }
    case 100:
      if (value < 10) {
        return `00${value}`;
      } else if (value < 100) {
        return `0${value}`;
      } else {
        return value.toString();
      }
    default:
      return "0";
  }
};

export const accountIdGenerator = (maxValue: number) => {
  const prefix = "A-";
  return prefix + decimalsNumber(maxValue, 100);
};

export const addressIdGenerator = (maxValue: number, user_id: string) => {
  const prefix = "ADR";
  return (
    prefix +
    decimalsNumber(parseInt(user_id), 10) +
    decimalsNumber(maxValue, 100)
  );
};

export const phoneNumberGenerator = (value: string) => {
  if (!value.startsWith("0", 0) && !value.startsWith("6")) {
    const prefix = "0";
    return prefix + value;
  } else if (value.startsWith("6", 0) && !value.startsWith("0")) {
    const prefix = "0";
    const restWords = value.slice(2, value.length);
    return prefix + restWords;
  } else {
    return value;
  }
};

export const getTotalAmount = (price: number, quantity: number) => {
  return price * quantity;
};

export const decimalDate = (num: number) => {
  return num < 9 ? `0${num}` : num;
};

export const getDateString = (value: any) => {
  const date = new Date(value);
  const day = decimalDate(date.getDay());
  const month = decimalDate(date.getMonth());
  const years = date.getFullYear();
  const hours = decimalDate(date.getHours());
  const minutes = decimalDate(date.getMinutes());
  const fullDate = `${day}/${month}/${years}, ${hours}:${minutes}`;
  return fullDate;
};

export function rupiahConverter(value: number) {
  const leadingText = "Rp.";
  const number = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const rupiah = leadingText + " " + number;

  return rupiah;
}

export const orderStatusConverter = (status: ORDER_STATUS) => {
  switch (status) {
    case "PENDING":
      return "Menunggu Pembayaran";
    case "PAID":
      return "Menunggu Pengiriman";
    case "PACKED":
      return "Sedang Dikemas";
    case "SHIPPED":
      return "Sedang Dikirim";
    case "DELIVERED":
      return "Telah Dikirim";
    case "FINISHED":
      return "Telah Diterima";
    default:
      return "Tidak Diketahui";
  }
};

export const sortAddress = (address: TAddress, primaryAddressId: string) => {
  if (address.address_id === primaryAddressId) {
    return -1;
  } else {
    return 0;
  }
};

export const variantIdGenerator = (productId: number, variantId: number) => {
  const product = decimalsNumber(productId, 100);
  const variant = decimalsNumber(variantId, 100);
  const prefix = "PV";
  return prefix + product + variant;
};

export const variantItemsIdGenerator = (
  productId: number,
  variantId: number
) => {
  const product = decimalsNumber(productId, 100);
  const variant = decimalsNumber(variantId, 100);
  const prefix = "PVI";
  return prefix + product + variant;
};

export const productCategoryIdGenerator = (maxId: number) => {
  const id = decimalsNumber(maxId, 10);
  const prefix = "CAT";
  return prefix + id;
};
