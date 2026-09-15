export type Credentials = {
  name: string;
  email: string;
  image: string;
};

export type MovementItemProps = {
  id: string;
  accountId: string;
  amount: number;
  status: string;
  created_at: Date;
};

export type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};
