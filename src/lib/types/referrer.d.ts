type TReferrer = {
  referrer_id: string;
  user_id: number | null;

  user: TUser | null;
  incomes: TIncome[];
};
