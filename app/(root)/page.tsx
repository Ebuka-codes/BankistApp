import { auth } from "@/auth";
import AccountSummary from "../_components/AccountSummary";
import Header from "../_components/Header";
import LoginRequired from "../_components/LoginRequired";
import Movements from "../_components/Movements";
import TransactionActions from "../_components/TransactionActions";
import { Suspense } from "react";
import Loading from "../_components/Loading";
import { getAccountByProps } from "@/lib/action";
import AccountNotFound from "../_components/AccountNotFound";

export default async function Home() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "User";
  const account = await getAccountByProps(
    "email",
    session?.user?.email as string,
  );

  return (
    <div>
      <Header />

      {!session?.user && <LoginRequired />}

      {session?.user && account.data.status === "active" && (
        <div>
          <span className="block sm:hidden items-center text-3xl font-normal mt-10">
            {session && `Welcome back, ${firstName}`}
          </span>
          <AccountSummary />
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-[4fr_3fr] gap-8">
            <Suspense fallback={<Loading />}>
              <Movements />
            </Suspense>
            <TransactionActions />
          </div>
        </div>
      )}

      {session?.user && account.data.status === "disabled" && (
        <AccountNotFound />
      )}
    </div>
  );
}
