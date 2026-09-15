import React from "react";
import Image from "next/image";
import { auth } from "@/auth";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const Header = async () => {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <header className="flex justify-between items-center border-b  border-stone-200 pb-6">
      <span className="hidden sm:block items-center gap-3 text-3xl font-medium">
        {session ? `Welcome back, ${firstName}` : "Login to get started"}
      </span>

      <Image
        src="/image/logo.png"
        alt="Logo"
        width={45}
        height={45}
        className="shrink-0 sm:w-18 sm:h-18"
      />

      {session?.user ? <LogoutButton /> : <LoginButton />}
    </header>
  );
};

export default Header;
