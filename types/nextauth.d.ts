import NextAuth from "next-auth";
// Extend the Session Type
declare module "next-auth" {
    interface Session {
        user: {
          username: string;
          password: string;
        }
      }
}