import React from "react";

const Loading = () => {
  return (
    <div className="flex h-100 flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-center">
      <div
        className={`border-transparent w-10 h-10 mx-auto  border-r-amber-500 border-t-amber-500 border-l-amber-500 rounded-full animate-spin border-[3px]`}
      ></div>
    </div>
  );
};

export default Loading;
