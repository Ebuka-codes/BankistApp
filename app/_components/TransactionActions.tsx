"use client";
import React from "react";
import LogoutTimer from "./LogoutTimer";
import DepositeCard from "./DepositCard";
import TransferCard from "./TransferCard";
import CloseAccountCard from "./CloseAccountCard";

const TransactionActions = () => {
  return (
    <div className="flex flex-col gap-8">
      <DepositeCard />
      <TransferCard />
      <CloseAccountCard />
      <LogoutTimer />
    </div>
  );
};

export default TransactionActions;
