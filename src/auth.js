// auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can define what the form looks like here, or build a custom UI (we'll do custom)
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // 1. Connect to your DB here (Postgres, MongoDB, etc.)
        // const user = await getUserFromDb(credentials.email)

        // MOCK USER FOR TESTING (Remove this later!)
        const user = {
          id: "1",
          name: "Developer",
          email: "dev@test.com",
          password: "123",
        };

        // 2. Check if user exists and password matches
        if (
          credentials.email === user.email &&
          credentials.password === user.password
        ) {
          // Return the user object to save it in the session
          return user;
        }

        // Return null if login fails
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Tell Auth.js we built our own page here
  },
});
