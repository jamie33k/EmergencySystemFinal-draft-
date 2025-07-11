import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USERS } from "@/lib/demo-data"

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
