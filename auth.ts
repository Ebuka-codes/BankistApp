import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createAccount } from "./lib/action";
import { starLogoutTimer } from "./lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      try {
        await createAccount({
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? "",
        });

        starLogoutTimer();

        return true;
      } catch (error) {
        return false;
      }
    },

    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
