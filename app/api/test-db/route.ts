import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USERS, emergencyRequests } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    console.log("=== API TEST ===")

    const adminUser = DEMO_USERS.find((u) => u.username === "Admin")

    return NextResponse.json({
      success: true,
      message: "API is working with centralized demo data",
      super_admin: {
        username: adminUser?.username,
        email: adminUser?.email,
        role: adminUser?.role,
        is_super_user: adminUser?.is_super_user,
        permissions: adminUser?.permissions,
      },
      demo_users: DEMO_USERS.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        phone: u.phone,
        is_super_user: u.is_super_user || false,
      })),
      emergency_requests_count: emergencyRequests.length,
      sample_emergency_requests: emergencyRequests.slice(0, 2),
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
