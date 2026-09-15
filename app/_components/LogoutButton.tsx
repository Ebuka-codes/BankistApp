"use client";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="cursor-pointer shrink-0 rounded-full bg-amber-300 px-10 py-3 text-lg font-medium uppercase text-gray-900"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
