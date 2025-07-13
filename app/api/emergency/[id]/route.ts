import { type NextRequest, NextResponse } from "next/server"
import { updateEmergencyRequestInMem, deleteEmergencyRequestInMem } from "@/lib/demo-data"

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

    const updatedRequest = updateEmergencyRequestInMem(id, updates)

    if (!updatedRequest) {
      console.log("Request not found for update")
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 })
    }

    console.log("Request updated successfully")

    return NextResponse.json({ emergencyRequest: updatedRequest })
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("=== DELETE EMERGENCY REQUEST ===")
    console.log("Request ID to delete:", id)

    if (!id) {
      return NextResponse.json({ error: "Emergency request ID is required" }, { status: 400 })
    }

    const deleted = deleteEmergencyRequestInMem(id)

    if (!deleted) {
      console.log("Request not found for deletion")
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 })
    }

    console.log("Request deleted successfully:", id)
    console.log("=== DELETE EMERGENCY REQUEST SUCCESS ===")

    return NextResponse.json({ success: true, message: "Emergency request deleted successfully" })
  } catch (error) {
    console.error("Delete emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
