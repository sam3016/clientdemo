import {
    getServerSession,
    type NextAuthOptions,
  } from "next-auth";
  import Credentials from "next-auth/providers/credentials";
  
  export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user}) {
        return { ...token, ...user };
      },
      // set token to user object
      async session({ session, token }) {
        return { ...session, user: token };
      },
    },
    pages: {
      signIn: '/', 
    },
    providers: [
        Credentials({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text", placeholder: "username" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            const username = credentials?.username ?? "";
            const password = credentials?.password ?? "";
            // Use Odata API to authenticate the account
            const res = await fetch(`https://${process.env.HOST}/fmi/odata/v4/${process.env.DATABASE}/${process.env.TABLE}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(username + ":" + password)
                }
            });

            const user = {
                id: username,
                username,
                password,
            }

            if (res.ok) {
                return user;
            }
    
            return null;
        },
      })
    ],
  };
  
  export const getServerAuthSession = () => getServerSession(authOptions); //(6)