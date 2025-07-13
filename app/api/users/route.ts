import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USERS, addDemoUser } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    console.log("=== GET USERS ===")

    // Remove passwords from response
    const usersWithoutPasswords = DEMO_USERS.map(({ password, ...user }) => user)

    console.log(`Returning ${usersWithoutPasswords.length} users`)

    return NextResponse.json({ users: usersWithoutPasswords })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    console.log("=== ADD USER ATTEMPT ===")
    console.log("User data:", { ...userData, password: "***" })

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

    const newUser = addDemoUser({ username, email, password, phone, role })

    console.log("User added successfully:", newUser.username)
    console.log("=== ADD USER SUCCESS ===")

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Add user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
