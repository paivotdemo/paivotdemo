import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import LinkedInProvider from "next-auth/providers/linkedin"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"
import type { User as PrismaUser } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import type { NextAuthOptions } from "next-auth"

// Define user type
interface User extends PrismaUser {
  role: string;
}

// Auth configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email 
            }
          });

          if (!user?.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID || "",
      clientSecret: process.env.LINKEDIN_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development",
}

// Server-side auth helpers
export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getServerAuthSession();
  return session?.user;
} 