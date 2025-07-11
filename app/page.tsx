"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignUpForm } from "@/components/auth/signup-form"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ResponderDashboard } from "@/components/dashboard/responder-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { Header } from "@/components/layout/header"
import { getCurrentUser } from "@/lib/auth"
import { wsManager } from "@/lib/websocket"
import type { User } from "@/lib/types"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    // Initialize WebSocket connection if user is logged in
    if (currentUser) {
      wsManager.connect()
    }

    return () => {
      wsManager.disconnect()
    }
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    wsManager.connect()
  }

  const handleSignUp = (newUser: User) => {
    setUser(newUser)
    wsManager.connect()
  }

  const handleSignOut = () => {
    setUser(null)
    wsManager.disconnect()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return isSignUp ? (
      <SignUpForm onSignUp={handleSignUp} onToggleMode={() => setIsSignUp(false)} />
    ) : (
      <LoginForm onLogin={handleLogin} onToggleMode={() => setIsSignUp(true)} />
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "client":
        return <ClientDashboard user={user} />
      case "responder":
        return <ResponderDashboard user={user} />
      case "admin":
        return <AdminDashboard user={user} />
      default:
        return <ClientDashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-8">{renderDashboard()}</main>
    </div>
  )
}
