"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, MapPin, Phone, User } from "lucide-react"
import type { EmergencyRequest, User as UserType } from "@/lib/types"

interface ResponderDashboardProps {
  user: UserType
}

export function ResponderDashboard({ user }: ResponderDashboardProps) {
  const [pendingRequests, setPendingRequests] = useState<EmergencyRequest[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      // Fetch pending requests
      const pendingResponse = await fetch("/api/emergency?status=Pending")
      const pendingData = await pendingResponse.json()

      // Fetch accepted requests by this responder
      const acceptedResponse = await fetch(`/api/emergency?responder_id=${user.id}`)
      const acceptedData = await acceptedResponse.json()

      if (pendingResponse.ok) {
        setPendingRequests(pendingData.requests || [])
      }

      if (acceptedResponse.ok) {
        setAcceptedRequests((acceptedData.requests || []).filter((r: EmergencyRequest) => r.status === "Accepted"))
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Accepted",
          responder_id: user.id,
        }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error accepting request:", error)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Declined" }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error declining request:", error)
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Completed" }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error completing request:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "Fire":
        return "🔥"
      case "Police":
        return "👮"
      case "Medical":
        return "🏥"
      default:
        return "⚠️"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Responder Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.username}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
            <CardDescription>Emergency requests waiting for response</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending requests</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEmergencyIcon(request.type)}</span>
                        <Badge variant="outline" className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant="outline">{request.type}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(request.created_at).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-sm mb-3">{request.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {request.client?.username}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {request.client?.phone}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button onClick={() => handleDeclineRequest(request.id)} variant="outline" size="sm">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Active Requests ({acceptedRequests.length})
            </CardTitle>
            <CardDescription>Requests you have accepted</CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No active requests</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {acceptedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEmergencyIcon(request.type)}</span>
                        <Badge variant="outline" className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className="bg-green-500">Accepted</Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{request.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {request.client?.username}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {request.client?.phone}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCompleteRequest(request.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
