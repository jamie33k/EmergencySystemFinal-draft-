"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, ArrowLeft } from "lucide-react"
import type { User } from "@/lib/types"
import { getCurrentLocation } from "@/lib/geolocation"

interface EmergencyFormProps {
  user: User
  onSubmit: () => void
  onCancel: () => void
}

export function EmergencyForm({ user, onSubmit, onCancel }: EmergencyFormProps) {
  const [formData, setFormData] = useState({
    type: "" as "Fire" | "Police" | "Medical" | "",
    priority: "" as "High" | "Medium" | "Low" | "",
    description: "",
  })
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = async () => {
    setLocationLoading(true)
    const currentLocation = await getCurrentLocation()
    setLocation(currentLocation)
    setLocationLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.type || !formData.priority || !formData.description) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!location) {
      setError("Location is required. Please enable location access.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: user.id,
          type: formData.type,
          priority: formData.priority,
          description: formData.description,
          location_lat: location.lat,
          location_lng: location.lng,
          city: location.city,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit emergency request")
      }

      onSubmit()
    } catch (error: any) {
      setError(error.message || "Failed to submit emergency request")
      console.error("Error submitting request:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-red-600">Report Emergency</CardTitle>
              <CardDescription>Fill out the form below to report an emergency</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Emergency Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "Fire" | "Police" | "Medical") => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fire">🔥 Fire</SelectItem>
                    <SelectItem value="Police">👮 Police</SelectItem>
                    <SelectItem value="Medical">🏥 Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "High" | "Medium" | "Low") => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">🔴 High</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the emergency situation in detail..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
                <MapPin className="h-4 w-4" />
                {locationLoading ? (
                  <span className="text-sm">Getting location...</span>
                ) : location ? (
                  <span className="text-sm">
                    {location.city} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                  </span>
                ) : (
                  <span className="text-sm text-red-500">Location not available</span>
                )}
                <Button type="button" variant="outline" size="sm" onClick={fetchLocation} disabled={locationLoading}>
                  Refresh
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !location} className="flex-1 bg-red-600 hover:bg-red-700">
                {loading ? "Submitting..." : "Submit Emergency"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
