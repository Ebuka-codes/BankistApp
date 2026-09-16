import { FileText, Ban } from "lucide-react";

const EmptyMovements = () => {
  return (
    <div className="flex py-20 w-full flex-col items-center shadow-sm justify-center rounded-xl border border-stone-200 bg-white px-6 text-center">
      <div className="relative mb-6">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-amber-50">
          <FileText size={64} strokeWidth={1.5} className="text-amber-200" />
        </div>

        <div className="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-white">
          <Ban size={38} strokeWidth={1.8} className="text-amber-500" />
        </div>
      </div>

      <h3 className="mb-2 text-2xl font-semibold text-stone-800">
        No Transactions Yet
      </h3>

      <p className="max-w-md text-xl leading-6 text-stone-500">
        Your transactions will appear here once you add money.
      </p>
    </div>
  );
};

export default EmptyMovements;
