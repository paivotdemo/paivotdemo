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

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Get the base URL for authentication
const baseUrl = process.env.NEXTAUTH_URL || (isProduction ? 'https://paivot.net' : 'http://localhost:3000');
console.log(`Auth base URL: ${baseUrl}, Environment: ${process.env.NODE_ENV}`);

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
          console.log("Missing credentials");
          return null;
        }

        try {
          // Test database connection first
          await prisma.$connect();
          console.log(`Attempting login for: ${credentials.email}`);
          
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email 
            }
          });

          if (!user) {
            console.log(`User not found: ${credentials.email}`);
            return null;
          }

          if (!user.password) {
            console.log(`User has no password: ${credentials.email}`);
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(`Invalid password for: ${credentials.email}`);
            return null;
          }

          console.log(`Successful login: ${credentials.email}`);
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
        } finally {
          await prisma.$disconnect();
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `${isProduction ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction ? (process.env.COOKIE_DOMAIN || '.paivot.net') : undefined,
      },
    },
    callbackUrl: {
      name: `${isProduction ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction ? (process.env.COOKIE_DOMAIN || '.paivot.net') : undefined,
      },
    },
    csrfToken: {
      name: `${isProduction ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: isProduction ? (process.env.COOKIE_DOMAIN || '.paivot.net') : undefined,
      },
    },
  },
  jwt: {
    // Explicitly set the max age to match the session
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback - initial sign in", { userId: user.id });
        return {
          ...token,
          id: user.id,
          role: (user as any).role || 'user',
        };
      }
      
      // Return previous token if the access token has not expired yet
      console.log("JWT callback - returning token", { tokenId: token.id });
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        console.log("Session callback", { tokenId: token.id });
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || 'user';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`Auth error: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`Auth warning: ${code}`);
    },
    debug(code, metadata) {
      console.debug(`Auth debug: ${code}`, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Server-side auth helpers
export async function getServerAuthSession() {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      console.log("Got server session for user:", session.user?.email);
    } else {
      console.log("No active session found");
    }
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerAuthSession();
    return session?.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
} 