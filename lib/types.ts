export type User = {
  id: string
  username: string
  email: string
  role: "client" | "responder" | "admin"
  phone?: string
  location_lat?: number
  location_lng?: number
  city?: string
  created_at?: string
  updated_at?: string
}

export type EmergencyRequest = {
  id: string
  client_id: string
  responder_id?: string
  type: "Fire" | "Police" | "Medical"
  priority: "High" | "Medium" | "Low"
  description: string
  location_lat: number
  location_lng: number
  city: string
  status: "Pending" | "Accepted" | "Declined" | "Completed"
  created_at: string
  updated_at: string
  client?: User
  responder?: User
}
