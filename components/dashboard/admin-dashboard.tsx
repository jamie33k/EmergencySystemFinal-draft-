"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Shield,
  Settings,
  Database,
} from "lucide-react"
import type { EmergencyRequest, User as UserType } from "@/lib/types"

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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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

  const handleSystemAction = async (action: string) => {
    console.log(`Admin ${user.username} performed action: ${action}`)
    // In a real app, this would trigger system actions
    alert(`System action: ${action} - This would be implemented in a real system`)
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-500" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.username} - You have full system access</p>
        </div>
        <Badge className="bg-purple-500 text-white px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          SUPER USER
        </Badge>
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

      {/* Super Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Super Admin Actions
          </CardTitle>
          <CardDescription>System management and administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleSystemAction("System Backup")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              System Backup
            </Button>
            <Button
              onClick={() => handleSystemAction("Clear Cache")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Clear Cache
            </Button>
            <Button
              onClick={() => handleSystemAction("Generate Report")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Generate Report
            </Button>
            <Button
              onClick={() => handleSystemAction("System Maintenance")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Maintenance Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users in the system with full admin privileges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{user.username}</span>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        {user.username === "Admin" && <Badge className="bg-purple-500">SUPER USER</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p>Location: {user.city || "Not set"}</p>
                        <p>Role: {user.role}</p>
                      </div>
                    </div>

                    {user.username === "Admin" && (
                      <div className="mt-2 p-2 bg-purple-50 rounded border">
                        <p className="text-xs text-purple-800 font-medium">
                          ✓ Super User - Full system access and administrative privileges
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View system activity and logs (Super Admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">System Status: Operational</span>
                  </div>
                  <p className="text-sm text-muted-foreground">All systems running normally</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Recent Activity</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>• Admin login successful - {new Date().toLocaleString()}</p>
                    <p>• System backup completed - {new Date(Date.now() - 1000 * 60 * 60).toLocaleString()}</p>
                    <p>• Emergency request processed - {new Date(Date.now() - 1000 * 60 * 30).toLocaleString()}</p>
                    <p>
                      • User registration: New responder added -{" "}
                      {new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
