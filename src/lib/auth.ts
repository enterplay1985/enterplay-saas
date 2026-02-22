import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { FieldSet } from "airtable";
import { airtableBase, type AirtableUserFields } from "@/lib/airtable";

type UserRecordFields = AirtableUserFields & FieldSet;

const USERS_TABLE_NAME = "Users";

async function findUserByCredentials(email: string, password: string) {
  const table = airtableBase<UserRecordFields>(USERS_TABLE_NAME);

  const records = await table
    .select({
      maxRecords: 1,
      filterByFormula: `AND({Email} = '${email}', {AppPassword} = '${password}')`,
    })
    .all();

  const record = records[0];
  if (!record) return null;

  const fields = record.fields;

  return {
    id: record.id,
    name: (fields.Name ?? "").toString(),
    email: (fields.Email ?? "").toString(),
    clientId: (fields.ClientID ?? "").toString(),
    role: (fields.Role ?? "owner").toString(),
    businessName: (fields.BusinessName ?? "").toString(),
    credits: Number(fields.Credits ?? 0),
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await findUserByCredentials(
          credentials.email,
          credentials.password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          clientId: user.clientId,
          role: user.role,
          businessName: user.businessName,
          credits: user.credits,
        };
      },
    }),
    // Futuro: aquí se puede añadir un proveedor de Google
    // GoogleProvider({...})
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.clientId = (user as any).clientId;
        token.role = (user as any).role;
        token.businessName = (user as any).businessName;
        token.credits = (user as any).credits;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).clientId = token.clientId;
        (session.user as any).role = token.role;
        (session.user as any).businessName = token.businessName;
        (session.user as any).credits = token.credits;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler };

