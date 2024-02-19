type TAddress = {
  address_id: string;
  district: string;
  village: string;
  full_address: string;
  label: string;
  recipient_name: string;
  recipient_phone_number: string;
  latidude: number; // TODO: Fix this typo
  longitude: number;

  city_id: string;
  city: TCity;
  user_id: number;
};

type TCity = {
  city_id: string;
  city_name: string;
  province_id: string;
  province: string;
  type: string;
  postal_code: string;
};

type TDistrict = {
  code: string;
  name: string;
};

type TVillage = {
  code: string;
  name: string;
};

type TProvince = {
  province_id: string;
  province: string;
};
