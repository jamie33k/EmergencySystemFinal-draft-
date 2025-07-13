import { type NextRequest, NextResponse } from "next/server"
import { deleteDemoUser } from "@/lib/demo-data"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("=== DELETE USER ATTEMPT ===")
    console.log("User ID to delete:", id)

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const deleted = deleteDemoUser(id)

    if (!deleted) {
      console.log("User not found for deletion")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User deleted successfully:", id)
    console.log("=== DELETE USER SUCCESS ===")

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
