import { ProductsAssets } from "./constants";
import { IProduct } from "./globals";

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

export const getProductDetail = (id: string) => {
  const productId = parseInt(id);
  const product: IProduct | null =
    ProductsAssets.find((product) => product.id === productId) ?? null;

  return product;
};

export const accountIdGenerator = (maxValue: number) => {
  const decimals =
    maxValue < 10 ? `00${maxValue}` : maxValue > 9 ? `0${maxValue}` : maxValue;
  const prefix = "A-";
  return prefix + decimals;
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
