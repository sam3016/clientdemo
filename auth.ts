import {
    getServerSession,
    type NextAuthOptions,
  } from "next-auth";
  import Credentials from "next-auth/providers/credentials";
  
  export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt", //(1) the default is jwt when no adapter defined, we redefined here to make it obvious what strategy that we use 
    },
    callbacks: {
      async jwt({ token, user}) {
        return { ...token, ...user };
      },
      async session({ session, token }) {
        return { ...session, user: token };
      },
    },
    pages: {
      signIn: '/', //(4) custom signin page path
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
            const res = await fetch(`https://${process.env.HOST}/fmi/odata/v4/${process.env.DATABASE}/${process.env.FILE}`, {
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