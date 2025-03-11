import NextAuth from "next-auth/next"
import { authOptions } from "@/lib/auth-server"

export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 