"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  User,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { EmergencyRequest, User as UserType } from "@/lib/types"
import { AddUserForm } from "./add-user-form"
import { EditEmergencyForm } from "./edit-emergency-form"

interface AdminDashboardProps {
  user: UserType
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditRequestDialogOpen, setIsEditRequestDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch all emergency requests
      const requestsResponse = await fetch("/api/emergency")
      const requestsData = await requestsResponse.json()

      // Fetch all users
      const usersResponse = await fetch("/api/users")
      const usersData = await usersResponse.json()

      if (requestsResponse.ok) {
        const allRequests = requestsData.requests || []
        setRequests(allRequests)

        // Calculate stats
        const total = allRequests.length
        const pending = allRequests.filter((r: EmergencyRequest) => r.status === "Pending").length
        const accepted = allRequests.filter((r: EmergencyRequest) => r.status === "Accepted").length
        const declined = allRequests.filter((r: EmergencyRequest) => r.status === "Declined").length
        const completed = allRequests.filter((r: EmergencyRequest) => r.status === "Completed").length

        setStats({ total, pending, accepted, declined, completed })
      }

      if (usersResponse.ok) {
        setUsers(usersData.users || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAdded = (newUser: UserType) => {
    setUsers((prevUsers) => [...prevUsers, newUser])
    setIsAddUserDialogOpen(false)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
        // Also refetch requests as deleting a user might affect client/responder IDs
        fetchData()
      } else {
        const errorData = await response.json()
        alert(`Failed to delete user: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("An error occurred while deleting the user.")
    }
  }

  const handleEditRequest = (request: EmergencyRequest) => {
    setSelectedRequest(request)
    setIsEditRequestDialogOpen(true)
  }

  const handleRequestUpdated = (updatedRequest: EmergencyRequest) => {
    setRequests((prevRequests) => prevRequests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)))
    setIsEditRequestDialogOpen(false)
    setSelectedRequest(null)
    fetchData() // Re-fetch to ensure client/responder data is updated
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to delete this emergency request? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId))
        fetchData() // Re-fetch stats
      } else {
        const errorData = await response.json()
        alert(`Failed to delete request: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deleting request:", error)
      alert("An error occurred while deleting the request.")
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500"
      case "responder":
        return "bg-blue-500"
      case "client":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.declined}</p>
                <p className="text-xs text-muted-foreground">Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>All Emergency Requests</CardTitle>
              <CardDescription>Monitor and track all emergency requests in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No emergency requests found</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getEmergencyIcon(request.type)}</span>
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

                      <p className="text-sm mb-3">{request.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Location: {request.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Client: {request.client?.username}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>Phone: {request.client?.phone}</span>
                          </div>
                          {request.responder && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>Responder: {request.responder.username}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleEditRequest(request)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRequest(request.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {selectedRequest && (
            <Dialog open={isEditRequestDialogOpen} onOpenChange={setIsEditRequestDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Emergency Request</DialogTitle>
                </DialogHeader>
                <EditEmergencyForm
                  request={selectedRequest}
                  onSave={handleRequestUpdated}
                  onCancel={() => setIsEditRequestDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>System Users</CardTitle>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <AddUserForm onUserAdded={handleUserAdded} onCancel={() => setIsAddUserDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users found</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{user.username}</span>
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "admin" && user.id === "3"} // Prevent deleting the main Admin demo user
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete user</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <p>Email: {user.email}</p>
                          <p>Phone: {user.phone || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                          <p>Location: {user.city || "Not set"}</p>
                          <p>Created: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
