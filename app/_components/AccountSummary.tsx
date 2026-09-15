import { auth } from "@/auth";
import { getAccountByProps, getMovementByAccountId } from "@/lib/action";
import { formattedAmount } from "@/lib/utils";

const AccountSummary = async () => {
  const session = await auth();
  let balance;
  let account;

  if (session?.user) {
    const email = session?.user?.email;
    const res = await getAccountByProps("email", email as string);

    account = res.data;

    if (res.data) {
      const { data } = await getMovementByAccountId(res.data.id);
      if (data) {
        balance = data.map((x) => x.amount).reduce((acc, cur) => acc + cur, 0);
      }
    }
  }

  return (
    <div className="flex item-center justify-between mt-10 sm:mt-16">
      <div className="space-y-2">
        <p className="text-3xl sm:text-4xl font-medium">Current balance</p>
        <p className="text-2xl ">Acct No: {account?.accountNumber}</p>
      </div>
      <p className="text-4xl sm:text-6xl font-normal text-gray-600">
        {formattedAmount(balance)}
      </p>
    </div>
  );
};

export default AccountSummary;
