"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import type { EmergencyRequest, User } from "@/lib/types"
import { EmergencyForm } from "./emergency-form"

interface ClientDashboardProps {
  user: User
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [showEmergencyForm, setShowEmergencyForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [user.id])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/emergency?client_id=${user.id}`)
      const data = await response.json()

      if (response.ok) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmergencySubmitted = () => {
    setShowEmergencyForm(false)
    fetchRequests()
  }

  const handleResendRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Pending" }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error resending request:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Accepted":
        return <CheckCircle className="h-4 w-4" />
      case "Declined":
        return <XCircle className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500"
      case "Accepted":
        return "bg-green-500"
      case "Declined":
        return "bg-red-500"
      case "Completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
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

  if (showEmergencyForm) {
    return (
      <EmergencyForm user={user} onSubmit={handleEmergencySubmitted} onCancel={() => setShowEmergencyForm(false)} />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report Emergency
            </CardTitle>
            <CardDescription>Report a new emergency and get immediate assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowEmergencyForm(true)} className="w-full bg-red-600 hover:bg-red-700" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Report Emergency
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Emergency Requests</CardTitle>
            <CardDescription>Track the status of your emergency requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No emergency requests yet</div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant="outline">{request.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-2">{request.description}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Location: {request.city} • {new Date(request.created_at).toLocaleString()}
                    </p>

                    {request.status === "Declined" && (
                      <Button
                        onClick={() => handleResendRequest(request.id)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Resend Request
                      </Button>
                    )}

                    {request.status === "Accepted" && request.responder && (
                      <div className="mt-2 p-2 bg-green-50 rounded border">
                        <p className="text-sm font-medium text-green-800">Accepted by: {request.responder.username}</p>
                        <p className="text-xs text-green-600">Contact: {request.responder.phone}</p>
                      </div>
                    )}
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
