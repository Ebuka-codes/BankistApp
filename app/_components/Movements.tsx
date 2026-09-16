import React from "react";
import MovementItem from "./MovementItem";
import EmptyMovements from "./EmptyMovement";
import { auth } from "@/auth";
import { getAccountByProps, getMovementByAccountId } from "@/lib/action";
import { MovementItemProps } from "./shared/type";
import { formattedAmount } from "@/lib/utils";

const Movements = async () => {
  let movements: MovementItemProps[] = [];
  const session = await auth();
  let creditSummary = 0;
  let debitSummary = 0;
  let interestSummary = 0;

  if (session?.user?.email) {
    const res = await getAccountByProps("email", session.user.email as string);

    if (res.data) {
      const { data } = await getMovementByAccountId(res.data.id);
      if (data) {
        movements = data;

        creditSummary = movements
          .map((x) => x.amount)
          .filter((deposit) => deposit > 0)
          .reduce((acc, cur) => acc + cur, 0);

        debitSummary = movements
          .map((x) => x.amount)
          .filter((deposit) => deposit < 0)
          .reduce((acc, cur) => acc + cur, 0);

        interestSummary = movements
          .map((x) => x.amount)
          .filter((interest) => interest > 0)
          .map((interest) => (interest * 1.2) / 100)
          .reduce((acc, cur) => acc + cur, 0);
      }
    }
  }

  return (
    <div>
      {movements.length > 0 ? (
        <div>
          <div className="overflow-y-auto max-h-180 h-full [scrollbar-width:thin] shadow-sm rounded-2xl bg-white border-stone-200">
            {movements.map((data) => (
              <MovementItem key={data.id} movement={data} />
            ))}
          </div>

          <div className="my-10">
            <h2 className="text-2xl font-medium border-b  border-stone-200 pb-3">
              Transactions Summary
            </h2>
            <div className="col-span-2 flex items-baseline gap-y-2 flex-wrap px-1 text-lg mt-5">
              <p className="mr-3 font-medium uppercase">In</p>

              <p className="mr-10 text-2xl text-green-500">
                {formattedAmount(creditSummary)}
              </p>

              <p className="mr-3 font-medium uppercase">Out</p>

              <p className="mr-10 text-2xl text-red-500">
                {formattedAmount(debitSummary)}
              </p>

              <p className="mr-3 font-medium uppercase">Interest</p>

              <p className="text-2xl text-green-500">
                {formattedAmount(interestSummary)}
              </p>

              <p className="mr-3 ml-10 font-medium uppercase">Interest Rate</p>

              <p className="text-2xl text-green-500">1.2</p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyMovements />
      )}
    </div>
  );
};

export default Movements;
