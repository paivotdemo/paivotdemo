import NextAuth from "next-auth/next"
import { authOptions } from "@/lib/auth-server"

// Force dynamic to ensure this route is not statically optimized
export const dynamic = 'force-dynamic'

// Log when the NextAuth handler is initialized
console.log('Initializing NextAuth handler')

let handler;

try {
  handler = NextAuth(authOptions)
  console.log('NextAuth handler initialized successfully')
} catch (error) {
  console.error('Error initializing NextAuth handler:', error)
  
  // Create an error handler function
  handler = () => {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to initialize authentication handler',
        message: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    )
  }
}

// Export the handler for GET and POST requests
export { handler as GET, handler as POST } 