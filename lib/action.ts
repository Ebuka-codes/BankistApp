"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Credentials, FormState } from "@/app/_components/shared/type";
import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import z from "zod";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

export async function handleDeposit(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        ...prevState,
        error: "You are not authenticated",
        status: "ERROR",
      };
    }

    const account = await getAccountByProps("email", session.user.email);

    if (!account.data) {
      return {
        ...prevState,
        error: "Account not found",
        status: "ERROR",
      };
    }

    const formSchema = z.object({
      amount: z.coerce.number().min(100, "Minimum deposit is 100"),
    });

    const result = formSchema.safeParse({
      amount: formData.get("amount"),
    });

    if (!result.success) {
      return {
        ...prevState,
        error: result.error.issues[0].message,
        status: "ERROR",
      };
    }

    const res = await depositeAmount(result.data.amount, account.data.id);

    if (res.status !== "SUCCESS") {
      toast.success("Deposit failed", {
        style: {
          fontSize: "14px",
        },
      });
      return {
        ...prevState,
        error: "Deposit failed",
        status: "ERROR",
      };
    }
    return {
      ...prevState,
      error: "",
      status: "SUCCESS",
    };
  } catch (error) {
    return {
      ...prevState,
      error: "Unexpected error occurred",
      status: "ERROR",
    };
  }
}

export async function handleTransfer(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        ...prevState,
        error: "You are not authenticated",
        status: "ERROR",
      };
    }

    const formSchema = z.object({
      accountNumber: z
        .string()
        .length(10, "Account number should be 10 digits"),

      amount: z.coerce.number().positive("Amount must be greater than 0"),
    });

    const result = formSchema.safeParse({
      accountNumber: formData.get("accountNumber"),
      amount: formData.get("amount"),
    });

    if (!result.success) {
      return {
        ...prevState,
        error: result.error.issues[0].message,
        status: "ERROR",
      };
    }

    const receiverAccount = await getAccountByProps(
      "accountNumber",
      result.data.accountNumber.trim(),
    );

    if (!receiverAccount.data) {
      return {
        ...prevState,
        error: "Receiver account not found",
        status: "ERROR",
      };
    }

    const senderAccount = await getAccountByProps("email", session.user.email);

    if (!senderAccount.data) {
      return {
        ...prevState,
        error: "Sender account not found",
        status: "ERROR",
      };
    }

    const res = await transferAmount(
      result.data.amount,
      receiverAccount.data.id,
      senderAccount.data.id,
    );

    if (res.status !== "SUCCESS") {
      return {
        ...prevState,
        error: res.error || "Transfer failed",
        status: "ERROR",
      };
    }

    return {
      ...prevState,
      error: "",
      status: "SUCCESS",
    };
  } catch (error) {
    return {
      ...prevState,
      error: "Unexpected error occurred",
      status: "ERROR",
    };
  }
}

export async function handleCloseAccount(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        ...prevState,
        error: "You are not authenticated",
        status: "ERROR",
      };
    }

    const formSchema = z.object({
      accountNumber: z
        .string()
        .length(10, "Account number should be 10 digits"),
    });

    const result = formSchema.safeParse({
      accountNumber: formData.get("accountNumber"),
    });

    if (!result.success) {
      return {
        ...prevState,
        error: result.error.issues[0].message,
        status: "ERROR",
      };
    }

    const account = await getAccountByProps(
      "accountNumber",
      result.data.accountNumber,
    );

    if (!account.data) {
      return {
        ...prevState,
        error: "Account not found",
        status: "ERROR",
      };
    }
    console.log();

    if (
      account.data.accountNumber !== Number(result.data.accountNumber.trim())
    ) {
      return {
        ...prevState,
        error: "Account Number does not exist",
        status: "ERROR",
      };
    }

    const res = await closeAccount(account.data.id);

    if (res.status !== "SUCCESS") {
      return {
        ...prevState,
        error: res.error || "Close Account failed",
        status: "ERROR",
      };
    }

    return {
      ...prevState,
      error: "",
      status: "SUCCESS",
    };
  } catch (error) {
    return {
      ...prevState,
      error: "Unexpected error occurred",
      status: "ERROR",
    };
  }
}

export async function getMovementByAccountId(accountId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Movements")
    .select("*")
    .eq("accountId", accountId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
}

export async function depositeAmount(amount: number, accountId: string) {
  const session = await auth();

  if (!session?.user) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Movements")
    .insert([
      {
        accountId: accountId,
        amount: amount,
        status: "Credited",
      },
    ])
    .select();

  if (error) {
    return parseServerActionResponse({
      error: error.message,
      status: "ERROR",
    });
  }
  revalidatePath("/");
  return {
    data,
    error: "",
    status: "SUCCESS",
  };
}

export async function transferAmount(
  amount: number,
  receiverId: string,
  senderId: string,
) {
  const session = await auth();

  if (!session?.user) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.rpc("transfer_money", {
      p_amount: amount,
      p_sender_id: senderId,
      p_receiver_id: receiverId,
    });

    if (error) {
      console.error("Transfer error:", error);

      return parseServerActionResponse({
        error: error.message,
        status: "ERROR",
      });
    }

    revalidatePath("/");

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Transfer error:", error);

    return parseServerActionResponse({
      error: "Transfer failed",
      status: "ERROR",
    });
  }
}

export async function closeAccount(accountId: string) {
  const session = await auth();

  if (!session?.user) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("Accounts")
      .update({
        status: "disabled",
      })
      .eq("id", accountId);
    if (error) {
      console.error("Close Account error:", error);

      return parseServerActionResponse({
        error: error.message,
        status: "ERROR",
      });
    }

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Close Account error:", error);

    return parseServerActionResponse({
      error: "Close Account failed",
      status: "ERROR",
    });
  }
}

export async function getAccountByProps(type: string, email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Accounts")
    .select("*")
    .eq(type, email)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
}

export async function createAccount(credential: Credentials) {
  const accountExists = await getAccountByProps("email", credential.email);

  if (accountExists.data) {
    return {
      data: accountExists.data,
      error: null,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Accounts")
    .insert([
      {
        email: credential.email,
        accountName: credential.name,
        accountNumber: Math.floor(Math.random() * 10000000000).toString(),
        image: credential.image,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  revalidatePath("/");

  return {
    data,
    error: null,
  };
}
