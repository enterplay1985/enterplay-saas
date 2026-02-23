import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { getAirtableUserByEmail, createAirtableUser } from "@/lib/airtable"; 

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/business.manage",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        
        // Buscamos o creamos el usuario en Airtable
        let dbUser = await getAirtableUserByEmail(user.email!);

        if (!dbUser) {
          dbUser = await createAirtableUser({
            email: user.email!,
            name: user.name || "Usuario Google"
          });
        }

        // Inyectamos los datos reales de Airtable al token
        if (dbUser) {
          token.clientId = dbUser.clientId;
          token.credits = dbUser.credits;
          token.recordId = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.clientId = token.clientId;
        session.user.credits = token.credits;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
};