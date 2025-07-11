import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USERS, emergencyRequests } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    console.log("=== API TEST ===")

    return NextResponse.json({
      success: true,
      message: "API is working with centralized demo data",
      demo_users: DEMO_USERS.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        phone: u.phone,
      })),
      emergency_requests_count: emergencyRequests.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "API test failed",
      },
      { status: 500 },
    )
  }
}
