import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extendemos la sesión para incluir el accessToken de Google
   */
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el JWT para que guarde el token temporalmente
   */
  interface JWT {
    accessToken?: string;
  }
}