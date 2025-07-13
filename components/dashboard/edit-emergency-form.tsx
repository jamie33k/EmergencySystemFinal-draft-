"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DialogFooter } from "@/components/ui/dialog"
import type { EmergencyRequest } from "@/lib/types"

interface EditEmergencyFormProps {
  request: EmergencyRequest
  onSave: (updatedRequest: EmergencyRequest) => void
  onCancel: () => void
}

export function EditEmergencyForm({ request, onSave, onCancel }: EditEmergencyFormProps) {
  const [formData, setFormData] = useState({
    type: request.type,
    priority: request.priority,
    description: request.description,
    status: request.status,
    responder_id: request.responder_id || "Unassigned",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [responders, setResponders] = useState<any[]>([])

  useEffect(() => {
    const fetchResponders = async () => {
      try {
        const response = await fetch("/api/users")
        const data = await response.json()
        if (response.ok) {
          setResponders(data.users.filter((u: any) => u.role === "responder"))
        }
      } catch (err) {
        console.error("Failed to fetch responders:", err)
      }
    }
    fetchResponders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.type || !formData.priority || !formData.description || !formData.status) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/emergency/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update emergency request")
      }

      onSave(data.emergencyRequest)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Emergency Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
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
        <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responder">Assign Responder</Label>
        <Select
          value={formData.responder_id}
          onValueChange={(value: any) => setFormData({ ...formData, responder_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select responder (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Unassigned">Unassigned</SelectItem>
            {responders.map((responder) => (
              <SelectItem key={responder.id} value={responder.id}>
                {responder.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
