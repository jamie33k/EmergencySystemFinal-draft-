import { type NextRequest, NextResponse } from "next/server"
import { emergencyRequests } from "@/lib/demo-data"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const { id } = params

    console.log("=== UPDATE EMERGENCY REQUEST ===")
    console.log("Request ID:", id)
    console.log("Updates:", updates)

    if (!id) {
      return NextResponse.json({ error: "Emergency request ID is required" }, { status: 400 })
    }

    const requestIndex = emergencyRequests.findIndex((req) => req.id === id)

    if (requestIndex === -1) {
      console.log("Request not found")
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 })
    }

    // Update the request
    emergencyRequests[requestIndex] = {
      ...emergencyRequests[requestIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    console.log("Request updated successfully")

    return NextResponse.json({ emergencyRequest: emergencyRequests[requestIndex] })
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
