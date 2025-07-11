import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USERS } from "@/lib/demo-data"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    console.log("=== SIGN UP ATTEMPT ===")
    console.log("Sign up data:", { ...userData, password: "***" })

    const { username, email, password, phone, role } = userData

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase(),
    )

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Password validation
    if (password.length < 3) {
      return NextResponse.json({ error: "Password must be at least 3 characters" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: (DEMO_USERS.length + 1).toString(),
      username,
      email,
      role,
      phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add to demo users (in real app, this would be saved to database)
    DEMO_USERS.push({ ...newUser, password })

    console.log("User created successfully:", newUser.username)
    console.log("=== SIGN UP SUCCESS ===")

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Sign up API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
