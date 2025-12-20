export const authConfig = {
  pages: {
    signIn: "/", // Updated to point to the root (Home Page)
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Keep this empty here to prevent database issues on the Edge
};
