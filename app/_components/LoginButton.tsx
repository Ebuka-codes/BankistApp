"use client";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  const handleLogin = async () => {
    await signIn("google", {
      redirectTo: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="cursor-pointer shrink-0 rounded-full bg-amber-300 hover:bg-amber-400 transition-all px-10 py-3 text-lg font-medium uppercase text-gray-900"
    >
      Login
    </button>
  );
};
export default LoginButton;
