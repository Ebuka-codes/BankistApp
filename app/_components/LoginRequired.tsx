import { LockKeyhole } from "lucide-react";

const LoginRequired = () => {
  return (
    <div className="flex mt-20 min-h-87.5 w-[90%] sm:w-[60%] mx-auto flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
        <LockKeyhole size={40} strokeWidth={1.6} className="text-amber-400" />
      </div>

      <h3 className="text-2xl font-semibold text-stone-800">
        You are not logged in
      </h3>

      <p className="mt-2 max-w-md text-xl leading-6 text-stone-500">
        Log in to your account to view your balance, transactions, and account
        activity.
      </p>
    </div>
  );
};

export default LoginRequired;
