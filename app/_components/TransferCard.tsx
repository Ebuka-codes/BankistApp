"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleTransfer } from "@/lib/action";
import MiniLoadingSpinner from "./MiniLoadingSpinner";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};

const initialState: FormState = {
  error: "",
  status: "INITIAL",
};

const TransferCard = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [state, formAction, isPending] = useActionState(
    handleTransfer,
    initialState,
  );

  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast.success("Transfer successful!", {
        style: {
          fontSize: "14px",
        },
      });
      window.location.reload();
    }

    if (state.status === "ERROR" && state.error) {
      toast.error(state.error, {
        style: {
          fontSize: "14px",
        },
      });
    }
  }, [state.status, state.error]);

  return (
    <div className="rounded-2xl bg-linear-to-br from-yellow-500 to-yellow-300 p-8 text-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">Transfer money</h2>

      <form
        action={formAction}
        className="grid grid-cols-[2.5fr_2.5fr_1fr] grid-rows-[auto_auto] gap-x-4 gap-y-2"
      >
        <input
          type="number"
          name="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full rounded-lg border-none bg-white/40 px-4 py-3 text-center text-lg outline-none"
        />

        <input
          type="number"
          name="amount"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border-none bg-white/40 px-4 py-3 text-center text-lg outline-none"
        />

        <button
          type="submit"
          disabled={!accountNumber || !amount || isPending}
          className="cursor-pointer rounded-lg border-none bg-white text-2xl transition hover:bg-gray-100 disabled:cursor-auto disabled:bg-gray-100"
        >
          {isPending ? <MiniLoadingSpinner /> : "→"}
        </button>

        <label className="text-center text-lg">Account Number</label>

        <label className="text-center text-lg">Amount</label>
      </form>
    </div>
  );
};

export default TransferCard;
