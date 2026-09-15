"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleDeposit } from "@/lib/action";
import MiniLoadingSpinner from "./MiniLoadingSpinner";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};

const initialState: FormState = {
  error: "",
  status: "INITIAL",
};

const DepositeCard = () => {
  const [depositAmount, setdepositAmount] = useState<string>("");

  const [state, formAction, isPending] = useActionState(
    handleDeposit,
    initialState,
  );

  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast.success("Deposite successful!", {
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
    <div className="rounded-2xl bg-linear-to-br from-green-500 to-green-300 p-8 text-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">Deposit money</h2>

      <form
        action={formAction}
        className="grid grid-cols-[10fr_1.5fr] grid-rows-[auto_auto] gap-x-4 gap-y-2"
      >
        <input
          type="number"
          name="amount"
          value={depositAmount}
          onChange={(e) => setdepositAmount(e.target.value)}
          min="100"
          className="w-full rounded-lg text-center border-none bg-white/40 px-4 py-3 text-lg outline-none"
        />

        <button
          type="submit"
          disabled={!depositAmount || isPending}
          className="rounded-lg disabled:bg-gray-100 disabled:cursor-auto border-none bg-white text-2xl cursor-pointer transition hover:bg-gray-100"
        >
          {isPending ? <MiniLoadingSpinner /> : "→"}
        </button>

        <label className="row-start-2 text-center text-lg">Amount</label>
      </form>
    </div>
  );
};

export default DepositeCard;
