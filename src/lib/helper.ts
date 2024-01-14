import {
  TAddress,
  TProduct,
  ORDER_STATUS,
  TProductVariantItem,
  TCustomerOrder,
  TSellerOrder,
} from "./globals";
import supabase from "./supabase";

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

export const getTotalAmount = (
  price: number,
  quantity: number,
  variant_price: number | null
) => {
  const totalAmount = variant_price
    ? (price + variant_price) * quantity
    : price * quantity;
  return totalAmount;
};

export const decimalDate = (num: number) => {
  return num < 9 ? `0${num}` : num;
};

export const getDateString = (value: any) => {
  const date = new Date(value);
  const day = decimalDate(date.getDate());
  const month = decimalDate(date.getMonth() + 1);
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
    default:
      if (status === "DELIVERED" || status === "FINISHED") {
        return "Telah Diterima Pelanggan";
      } else {
        return "Tidak Diketahui";
      }
  }
};

export const sortAddress = (address: TAddress, primaryAddressId: string) => {
  if (address.address_id === primaryAddressId) {
    return -1;
  } else {
    return 0;
  }
};

export const variantIdGenerator = (
  productName: string,
  variantName: string
) => {
  const productPrefix = prefixMaker(productName, "triple");
  const variantPrefix = prefixMaker(variantName, "single");
  return `${productPrefix}${variantPrefix}`;
};

export const variantItemsIdGenerator = (
  productName: string,
  variantName: string,
  variantItemName: string
) => {
  const productPrefix = prefixMaker(productName, "triple");
  const variantPrefix = prefixMaker(variantName, "single");
  const variantItemPrefix = variantItemName
    .slice(0, variantItemName.length >= 3 ? 3 : variantItemName.length)
    .toUpperCase();

  return `${productPrefix}${variantPrefix}${variantItemPrefix}`;
};

export const productCategoryIdGenerator = (maxId: number) => {
  const id = decimalsNumber(maxId, 10);
  const prefix = "CAT";
  return prefix + id;
};

export const customerOrderIdGenerator = (maxId: number) => {
  const date = new Date();
  const day = decimalsNumber(date.getDate(), 10);
  const month = decimalsNumber(date.getMonth() + 1, 10);
  const years = date.getFullYear().toString().slice(2, 4);

  const fullDate = `${day}${month}${years}`;
  const orderId = decimalsNumber(maxId, 100);
  const prefix = "ORD";
  return prefix + fullDate + orderId;
};

export const prefixMaker = (value: string, options: "single" | "triple") => {
  const joinnedName = value.split(" ");
  const wordsLength = joinnedName.length;

  if (wordsLength > 1) {
    const words = [joinnedName[0], joinnedName[1]];
    const first = words[0][0];
    const second = words[0][2];
    const last = words[1][0];
    const prefix =
      options === "triple"
        ? `${first}${second}${last}`.toUpperCase()
        : `${first}`.toUpperCase();

    return prefix;
  } else {
    const words = joinnedName[0];
    const _length = words.length;

    const middleCharIndex = _length > 4 ? 2 : 1;
    const lastCharIndex =
      _length > 5 ? _length - 4 : _length > 4 ? _length - 2 : _length - 1;

    const first = words[0];
    const second = words[middleCharIndex];
    const last = words[lastCharIndex];
    const prefix =
      options === "triple"
        ? `${first}${second}${last}`.toUpperCase()
        : `${first}`.toUpperCase();

    return prefix;
  }
};

export const customerOrderItemIdGenerator = (
  productName: string,
  currentProductCount: number
) => {
  const joinnedName = productName.split(" ");
  const wordsLength = joinnedName.length;
  const productCount = decimalsNumber(currentProductCount, 100);

  if (wordsLength > 1) {
    const words = [joinnedName[0], joinnedName[1]];
    const first = words[0][0];
    const second = words[0][2];
    const last = words[1][0];
    const prefix = `${first}${second}${last}${productCount}`.toUpperCase();

    return prefix;
  } else {
    const words = joinnedName[0];
    const _length = words.length;

    const middleCharIndex = _length > 4 ? 2 : 1;
    const lastCharIndex =
      _length > 5 ? _length - 4 : _length > 4 ? _length - 2 : _length - 1;

    const first = words[0];
    const second = words[middleCharIndex];
    const last = words[lastCharIndex];
    const prefix = `${first}${second}${last}${productCount}`.toUpperCase();

    return prefix;
  }
};

export const NaNHandler = (value: number) => {
  return isNaN(value) ? 0 : value;
};

export const fetcher = (url: string) =>
  fetch(url).then((response) => response.json());

export const createImagePreview = (file: File) => {
  const imageUrl = URL.createObjectURL(file);
  return imageUrl;
};

export const uploadImage = async (
  image: File,
  imageName: string,
  bucket: string
) => {
  const { data: uploadedImage, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(imageName, image, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadedImage) {
    const { data: imageURL } = supabase.storage
      .from(bucket)
      .getPublicUrl(imageName);

    return {
      imageURL: imageURL.publicUrl,
      error: null,
    };
  } else {
    console.log("An error occurred: ", uploadError);
    return {
      imageURL: null,
      error: uploadError.message,
    };
  }
};

export const remoteImageSource = (source: string) => {
  const date = new Date();
  const timestamp = date.getTime();
  return `${source}?t=${timestamp}`;
};

export const permissionHelper = (a: string, b: string) => {
  return a === b;
};

export const userRoleConverter = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "SELLER":
      return "Penjual";
    case "CUSTOMER":
      return "Pelanggan";

    default:
      return "Tidak diketahui";
  }
};

export const invoiceMaker = async (
  user_id: string,
  product: TProduct,
  product_quantity: number,
  shipping_address: TAddress,
  shipping_cost: number,
  product_variant: TProductVariantItem | null,
  total_price: number,
  isPreorder: boolean = false
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ORDER_CREATE!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id,
        product: product,
        product_quantity: product_quantity,
        shipping_address: shipping_address,
        product_variant: product_variant,
        total_price: total_price,
        shipping_cost: shipping_cost,
        isPreorder: isPreorder,
      }),
    });

    const response = await res.json();
    if (!response.ok) {
      return {
        ok: false,
        message:
          "Terjadi kesalahan ketika melakukan pemesanan, silahkan coba lagi nanti.",
      };
    } else {
      return {
        ok: true,
        message: "Pemesanan berhasil, mengarahkan ke halaman pesanan...",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message:
        "Terjadi kesalahan ketika melakukan pemesanan, silahkan coba lagi nanti.",
    };
  }
};

export const cartIdGenerator = (user_id: number) => {
  const _user_id = decimalsNumber(user_id, 100);
  const prefix = "CRT";
  return prefix + _user_id;
};

export const cartItemIdGenerator = (
  user_id: number,
  product_id: number,
  max_item_id: number
) => {
  const _user_id = decimalsNumber(user_id, 100);
  const _product_id = decimalsNumber(product_id, 100);
  const _max_item_id = decimalsNumber(max_item_id, 100);
  const prefix = "CRTITM";
  return prefix + _user_id + _product_id + _max_item_id;
};

export const calculateCartCosts = (
  product_price: number,
  product_quantity: number,
  product_variant_price: number
) => {
  const total_price = product_price * product_quantity;
  const total_variant_price = product_variant_price * product_quantity;
  const total_cost = total_price + total_variant_price;
  return total_cost;
};

export const convertStringToBoolean = (value: "true" | "false") => {
  return value === "true";
};

export const showProductSoldCount = (sold_count: number) => {
  if (sold_count <= 99) {
    return sold_count.toString();
  } else {
    return "99+";
  }
};

export const sortOrders = (orders: TSellerOrder[] | TCustomerOrder[]) => {
  const firstOrdersStatus: ORDER_STATUS = "PENDING";

  const sortedOrders = orders.sort((a, b) => {
    if (a.order_status === firstOrdersStatus) {
      return -1;
    } else {
      return 0;
    }
  });

  return sortedOrders;
};

export const shippingEstimation = (days: string) => {
  const daysNumber = days.split("-");
  const dayTo = parseInt(daysNumber[1]);

  return dayTo;
};

export const getOrderType = (orderType: "NORMAL" | "PREORDER") => {
  switch (orderType) {
    case "NORMAL":
      return "Reguler";
    case "PREORDER":
      return "Pre-order";

    default:
      return "Reguler";
  }
};

export const getSales = (
  salesData: TSalesReportData[],
  start: number,
  end: number
) => {
  const monthStrings = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dates = salesData.map((data) => {
    const date = new Date(data.order_date);
    const month = date.getMonth();
    const year = date.getFullYear();

    return {
      month: month,
      year: year,
    };
  });

  const salesDatasets: {
    [key: string]: {
      [key: string]: number;
    };
  } = {};

  dates.forEach((date) => {
    const year = date.year;

    for (let key = start; key <= end; key++) {
      if (!salesDatasets[year]) {
        salesDatasets[year] = {};
      }

      salesDatasets[year][monthStrings[key]] = dates.filter(
        (value) => value.month === key && value.year === year
      ).length;
    }
  });

  return salesDatasets;
};

export const getMonthString = (start: number, end: number) => {
  const monthStrings = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return monthStrings.slice(start, end);
};

export const getTotalProducts = (
  salesData: TSalesReportData[],
  start: number,
  end: number
) => {
  const data = salesData.filter((data) => {
    const date = new Date(data.order_date);
    const month = date.getMonth();

    return month >= start && month <= end;
  });

  const items = data.flatMap((data) => data.order_item);
  const totalProducts = items.map((item) => item.order_quantity);
  const total = totalProducts.reduce((a, b) => a + b, 0);

  return total;
};

export type TSalesByMonth = {
  [key: number]: TSalesReportData[];
};

export const getSalesByMonth = (sales: TSalesReportData[]) => {
  const groupedSales: TSalesByMonth = {};

  sales.forEach((sale) => {
    const orderMonth = new Date(sale.order_date).getMonth();

    if (!groupedSales[orderMonth]) {
      groupedSales[orderMonth] = [];
    }

    groupedSales[orderMonth].push(sale);
  });

  const salesMonths = Object.keys(groupedSales).map((key) => parseInt(key));

  return {
    groupedSales: groupedSales,
    salesMonths: salesMonths,
  };
};

export const getTotalIncome = (sales: TSalesReportData[]) => {
  let totalIncome = 0;

  sales.forEach((sale) => {
    const totalItems = sale.order_item.reduce(
      (a, b) =>
        a +
        b.order_quantity *
          (b.variant ? b.variant.variant_price : b.product.price),
      0
    );
    totalIncome += totalItems;
  });

  return totalIncome;
};

export type TReportsProductsIdentifications = {
  [key: string]: {
    name: string;
    quantity: number;
    price: number;
    images: string[];
    seller?: string;
    unit: string;
  };
};

export const identifyProducts = (sales: TSalesReportData[]) => {
  const items = sales.map((sale) => sale.order_item).flat();
  const products: TReportsProductsIdentifications = {};
  items.forEach((item) => {
    const id = item.variant
      ? item.variant.variant_item_id
      : item.product.id.toString();
    const name = item.variant
      ? `${item.product.title} - ${item.variant.variant_name}`
      : item.product.title;
    const price = item.variant
      ? item.variant.variant_price
      : item.product.price;
    const unit = item.product.unit;

    const images = item.product.images;
    const seller = item.product.seller.account?.user_name;

    if (!products[id]) {
      products[id] = {
        name: name,
        quantity: item.order_quantity,
        price: price,
        images: images,
        seller: seller,
        unit: unit,
      };
    } else {
      products[id].quantity += item.order_quantity;
    }
  });

  const sortedProducts = Object.entries(products)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .map(([key, value]) => ({ [key]: value }));

  const productsIds = sortedProducts
    .map((product) => Object.keys(product))
    .flat();

  return {
    ids: productsIds,
    products: products ? sortedProducts : null,
    highestSelling:
      sortedProducts.length > 0 ? sortedProducts[0][productsIds[0]] : null,
    lowestSelling:
      sortedProducts.length > 0
        ? sortedProducts[sortedProducts.length - 1][
            productsIds[productsIds.length - 1]
          ]
        : null,
  };
};

export const lowestSellingProducts = (products: TProduct[]) => {
  const lowestSelling = products.filter(
    (product) => product.status === "APPROVED" && product.sold_count < 1
  );

  return lowestSelling;
};

export type TSellerIncomes = {
  [key: string]: {
    name: string;
    income: number;
    products: TSalesReportOrderItem[];
  };
};

export type TReportIncomes = {
  [key: string]: {
    product_development: number;
    student_savings: number;
    seller_income: number;
  };
};

export type TReportIncomesTotal = {
  rawIncomes: number;
  product_sold: number;
  product_development: number;
  student_savings: number;
  seller_income: number;
};

export const getSellerIncomes = (sales: TSalesReportData[]) => {
  const sellerIncomes: TSellerIncomes = {};

  const items = sales.map((sale) => sale.order_item).flat();

  items.forEach((item) => {
    const sellerId = item.product.seller.user_id;
    const sellerName = item.product.seller.account?.user_name;
    const sellerIncome =
      item.order_quantity *
      (item.variant ? item.variant.variant_price : item.product.price);

    if (!sellerIncomes[sellerId]) {
      sellerIncomes[sellerId] = {
        name: sellerName!,
        income: sellerIncome,
        products: [item],
      };
    } else {
      sellerIncomes[sellerId].income += sellerIncome;
      sellerIncomes[sellerId].products.push(item);
    }
  });

  const sellerIds = Object.keys(sellerIncomes);

  const incomesDetail: TReportIncomes = {};

  sellerIds.forEach((id) => {
    const _sellerIncomes = sellerIncomes[id];
    const productDevelopment = _sellerIncomes.income * 0.5;
    const student_savings = _sellerIncomes.income * 0.2;
    const seller_income = _sellerIncomes.income * 0.3;

    if (!incomesDetail[id]) {
      incomesDetail[id] = {
        product_development: productDevelopment,
        student_savings: student_savings,
        seller_income: seller_income,
      };
    } else {
      incomesDetail[id].product_development += productDevelopment;
      incomesDetail[id].student_savings += student_savings;
      incomesDetail[id].seller_income += seller_income;
    }
  });

  const productSoldTotal = items.reduce((a, b) => a + b.order_quantity, 0);
  const rawIncomeTotal = items.reduce(
    (a, b) =>
      a +
      b.order_quantity *
        (b.variant ? b.variant.variant_price : b.product.price),
    0
  );
  const totalProductDevelopment = rawIncomeTotal * 0.5;
  const totalStudentSavings = rawIncomeTotal * 0.2;
  const totalSellerIncome = rawIncomeTotal * 0.3;

  const totalIncomes: TReportIncomesTotal = {
    rawIncomes: rawIncomeTotal,
    product_sold: productSoldTotal,
    product_development: totalProductDevelopment,
    student_savings: totalStudentSavings,
    seller_income: totalSellerIncome,
  };

  return {
    incomes: sellerIncomes,
    sellerIds: sellerIds,
    detailedIncomes: incomesDetail,
    totalIncomes: totalIncomes,
  };
};

export const highestProductsSellingWeekly = (sales: TSalesReportData[]) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const salesWeekly = sales.filter(
    (sale) => new Date(sale.order_date) > sevenDaysAgo
  );

  const products = identifyProducts(salesWeekly);
  const highestSellingProducts = products.highestSelling
    ? products.highestSelling
    : null;

  return highestSellingProducts;
};

export const getDateWithoutTime = (date: any) => {
  const _date = new Date(date);
  const year = _date.getFullYear();
  const month = _date.getMonth();
  const monthString = getMonthString(month, month + 1);
  const day = _date.getDate();

  return `${decimalDate(day)} ${monthString} ${year}`;
};

export const sortReportsData = (data: TSalesReportData[]) => {
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.order_date);
    const dateB = new Date(b.order_date);

    return dateA.getMonth() - dateB.getMonth();
  });

  return sortedData;
};

export const getPeriodTime = (start: number, end: number) => {
  const months = getMonthString(start, end);
  const startMonth = months[0];
  const endMonth = months[months.length - 1];

  return {
    start: startMonth,
    end: endMonth,
  };
};

export const reportMessage = (sales: TSalesReportData[]) => {
  const totalIncomes = sales.reduce(
    (a, b) =>
      a +
      b.order_item.reduce(
        (c, d) =>
          c +
          d.order_quantity *
            (d.variant ? d.variant.variant_price : d.product.price),
        0
      ),
    0
  );

  const totalSales = sales.length;
  const productSold = sales.reduce(
    (a, b) => a + b.order_item.reduce((c, d) => c + d.order_quantity, 0),
    0
  );
  const highestSelling = identifyProducts(sales).highestSelling;

  const breakLine = "\n";
  const message = `Pada periode ini, terdapat ${totalSales} penjualan yang terjadi, dengan total produk yang terjual sebanyak ${productSold} produk, dan total pendapatan adalah sebesar ${rupiahConverter(
    totalIncomes
  )}.`;

  const highestSellingMessage = highestSelling
    ? `Produk terlaris pada periode ini adalah ${
        highestSelling.name
      } dengan total produk terjual sebanyak ${highestSelling.quantity} ${
        highestSelling.unit
      }, dan total pendapatan sebesar ${rupiahConverter(
        highestSelling.quantity * highestSelling.price
      )}.`
    : "";

  return highestSelling ? message + breakLine + highestSellingMessage : message;
};

export const getSalesYears = (sales: TSalesReportData[]) => {
  let years: string[] = [];
  const dates = sales.map((sale) => new Date(sale.order_date));
  const orderYears = dates.map((date) => date.getFullYear());

  orderYears.forEach((year) => {
    if (!years.includes(year.toString())) {
      years.push(year.toString());
    }
  });

  return years;
};

export const filterSalesByDate = (
  year: string,
  startMonth: string,
  endMonth: string,
  sales: TSalesReportData[]
) => {
  const isOddDate = () => {
    const month = parseInt(endMonth);
    return month % 2 === 0;
  };

  const startDate = new Date(`${year}-${startMonth}-01`);
  const endDate = new Date(
    `${year}-${endMonth}-${
      isOddDate() ? "30" : isOddDate() && endMonth === "02" ? "28" : "31"
    }`
  );

  const salesData = sales.filter((sale) => {
    const orderDate = new Date(sale.order_date);
    return orderDate >= startDate && orderDate <= endDate;
  });

  return salesData;
};
