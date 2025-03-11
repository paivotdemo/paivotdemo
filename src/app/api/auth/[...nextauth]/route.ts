import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import LinkedInProvider from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is temporary! In production, you should properly validate credentials
        return {
          id: "1",
          email: credentials?.email,
          name: credentials?.email?.split('@')[0],
          image: null
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
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 