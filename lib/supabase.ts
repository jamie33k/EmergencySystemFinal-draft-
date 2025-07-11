import { createClient } from "@supabase/supabase-js"

// For client-side operations, we still need the Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aogpsrgdvlclxfmyivfb.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database URL for server-side operations
export const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:[YOUR-PASSWORD]@db.aogpsrgdvlclxfmyivfb.supabase.co:5432/postgres"

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
