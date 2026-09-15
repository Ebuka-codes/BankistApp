import React from "react";
import { MovementItemProps } from "./shared/type";
import { formattedAmount, formattedDateTime } from "@/lib/utils";

const MovementItem = async ({ movement }: { movement: MovementItemProps }) => {
  return (
    <div className="row-span-3">
      {/* Movement 1 */}
      <div className="flex items-center border-b border-gray-200 px-5 py-6">
        <div className="text-[13px] font-medium uppercase text-gray-500">
          {formattedDateTime(movement.created_at)}
        </div>

        <div
          className={
            movement.status === "Credited"
              ? "text-[15px] ml-auto text-green-500"
              : "text-[15px]  ml-auto  text-red-500"
          }
        >
          {formattedAmount(movement.amount)}
        </div>
      </div>
    </div>
  );
};

export default MovementItem;
