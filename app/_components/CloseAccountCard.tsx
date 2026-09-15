import { handleCloseAccount } from "@/lib/action";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import MiniLoadingSpinner from "./MiniLoadingSpinner";
import { signOut } from "next-auth/react";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};

const initialState: FormState = {
  error: "",
  status: "INITIAL",
};

const CloseAccountCard = () => {
  const [accountNumber, setAccountNumber] = useState("");

  const [state, formAction, isPending] = useActionState(
    handleCloseAccount,
    initialState,
  );

  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast.success("Account Closed successful!", {
        style: {
          fontSize: "14px",
        },
      });

      setTimeout(() => {
        signOut({ redirectTo: "/" });
      }, 1000);
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
    <div className="rounded-2xl bg-linear-to-br from-red-500 to-red-400 p-8 text-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">Close account</h2>

      <form
        action={formAction}
        className="grid grid-cols-[10fr_1.5fr] grid-rows-[auto_auto] gap-x-4 gap-y-2"
      >
        <input
          type="number"
          name="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full rounded-lg text-center border-none bg-white/40 px-4 py-3 text-lg outline-none"
        />

        <button
          type="submit"
          disabled={!accountNumber || isPending}
          className="cursor-pointer rounded-lg border-none bg-white text-2xl transition hover:bg-gray-100 disabled:cursor-auto disabled:bg-gray-100"
        >
          {isPending ? <MiniLoadingSpinner /> : "→"}
        </button>

        <label className="row-start-2 text-center text-lg">
          Account Number
        </label>
      </form>
    </div>
  );
};

export default CloseAccountCard;
