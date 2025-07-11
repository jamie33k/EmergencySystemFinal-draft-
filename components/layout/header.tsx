"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, AlertTriangle, Users } from "lucide-react"
import type { User } from "@/lib/types"
import { signOut } from "@/lib/auth"

interface HeaderProps {
  user: User
  onSignOut: () => void
}

export function Header({ user, onSignOut }: HeaderProps) {
  const handleSignOut = () => {
    signOut()
    onSignOut()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "responder":
        return <AlertTriangle className="h-4 w-4" />
      case "client":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold">Huduma Emergency Connect</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className={getRoleColor(user.role)}>
              {getRoleIcon(user.role)}
              {user.role}
            </Badge>
            <span className="text-sm font-medium">{user.username}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
