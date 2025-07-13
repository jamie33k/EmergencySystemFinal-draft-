import { type NextRequest, NextResponse } from "next/server"
import { emergencyRequests, findUserById } from "@/lib/demo-data"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    console.log("=== CREATE EMERGENCY REQUEST ===")
    console.log("Request data:", requestData)

    const { client_id, type, priority, description, location_lat, location_lng, city } = requestData

    if (
      !client_id ||
      !type ||
      !priority ||
      !description ||
      location_lat === undefined ||
      location_lng === undefined ||
      !city
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const newRequest = {
      id: (emergencyRequests.length + 1).toString(),
      client_id,
      type,
      priority,
      description,
      location_lat: Number.parseFloat(location_lat),
      location_lng: Number.parseFloat(location_lng),
      city,
      status: "Pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    emergencyRequests.push(newRequest)
    console.log("Emergency request created:", newRequest.id)

    return NextResponse.json({ emergencyRequest: newRequest })
  } catch (error) {
    console.error("Create emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client_id = searchParams.get("client_id")
    const responder_id = searchParams.get("responder_id")
    const status = searchParams.get("status")

    console.log("=== GET EMERGENCY REQUESTS ===")
    console.log("Filters:", { client_id, responder_id, status })

    let filteredRequests = [...emergencyRequests]

    if (client_id) {
      filteredRequests = filteredRequests.filter((req) => req.client_id === client_id)
    }

    if (responder_id) {
      filteredRequests = filteredRequests.filter((req) => req.responder_id === responder_id)
    }

    if (status) {
      filteredRequests = filteredRequests.filter((req) => req.status === status)
    }

    // Add client and responder data
    const requestsWithUserData = filteredRequests.map((req) => {
      const client = findUserById(req.client_id)
      const responder = req.responder_id ? findUserById(req.responder_id) : null

      return {
        ...req,
        client: client
          ? {
              id: client.id,
              username: client.username,
              phone: client.phone,
              email: client.email,
            }
          : null,
        responder: responder
          ? {
              id: responder.id,
              username: responder.username,
              phone: responder.phone,
              email: responder.email,
            }
          : null,
      }
    })

    console.log(`Returning ${requestsWithUserData.length} requests`)

    return NextResponse.json({ requests: requestsWithUserData })
  } catch (error) {
    console.error("Get emergency requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
