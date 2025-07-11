import { type NextRequest, NextResponse } from "next/server"
import { findUserByCredentials } from "@/lib/demo-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    console.log("=== SIGN IN ATTEMPT ===")
    console.log("Input:", { usernameOrEmail, password })

    if (!usernameOrEmail || !password) {
      console.log("Missing credentials")
      return NextResponse.json({ error: "Username/email and password are required" }, { status: 400 })
    }

    // Find user using centralized function
    const user = findUserByCredentials(usernameOrEmail, password)

    if (!user) {
      console.log("User not found or password incorrect")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    console.log("Authentication successful for:", userWithoutPassword.username)
    console.log("=== SIGN IN SUCCESS ===")

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Sign in API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
