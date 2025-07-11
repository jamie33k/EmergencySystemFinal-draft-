// Centralized demo data store
export const DEMO_USERS = [
  {
    id: "1",
    username: "PeterNjiru",
    email: "peter@example.com",
    password: "PeterNjiru",
    role: "client" as const,
    phone: "+254700000001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    username: "SashaMunene",
    email: "sasha@example.com",
    password: "SashaMunene",
    role: "responder" as const,
    phone: "+254700000002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    username: "Admin",
    email: "kipronojamie@gmail.com",
    password: "Admin",
    role: "admin" as const,
    phone: "+254798578853",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Super user privileges
    is_super_user: true,
    permissions: ["read", "write", "delete", "manage_users", "manage_system", "view_all_data"],
  },
]

// In-memory storage for emergency requests
export const emergencyRequests: any[] = [
  // Add some sample emergency requests for testing
  {
    id: "1",
    client_id: "1",
    responder_id: null,
    type: "Medical",
    priority: "High",
    description: "Heart attack emergency at downtown office",
    location_lat: -1.2921,
    location_lng: 36.8219,
    city: "Nairobi",
    status: "Pending",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    client_id: "1",
    responder_id: "2",
    type: "Fire",
    priority: "High",
    description: "Building fire on 3rd floor",
    location_lat: -1.2864,
    location_lng: 36.8172,
    city: "Nairobi",
    status: "Accepted",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: "3",
    client_id: "1",
    responder_id: "2",
    type: "Police",
    priority: "Medium",
    description: "Theft reported at local shop",
    location_lat: -1.2833,
    location_lng: 36.8167,
    city: "Nairobi",
    status: "Completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
]

// Helper function to find user by credentials
export function findUserByCredentials(usernameOrEmail: string, password: string) {
  console.log("=== CREDENTIAL CHECK ===")
  console.log("Looking for user:", { usernameOrEmail, password })
  console.log(
    "Available users:",
    DEMO_USERS.map((u) => ({ username: u.username, email: u.email, role: u.role })),
  )

  const user = DEMO_USERS.find((u) => {
    const matchesUsername = u.username === usernameOrEmail // Exact match for username
    const matchesEmail = u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    const matchesPassword = u.password === password // Exact match for password

    console.log(`Checking user ${u.username}:`, {
      matchesUsername,
      matchesEmail,
      matchesPassword,
      inputPassword: password,
      userPassword: u.password,
    })

    return (matchesUsername || matchesEmail) && matchesPassword
  })

  console.log("Found user:", user ? `${user.username} (${user.role})` : "none")
  console.log("=== CREDENTIAL CHECK END ===")
  return user
}

// Helper function to get user by ID
export function findUserById(id: string) {
  return DEMO_USERS.find((u) => u.id === id)
}

// Helper function to check if user is admin/super user
export function isAdminUser(user: any) {
  return user && (user.role === "admin" || user.is_super_user === true)
}

// Helper function to check user permissions
export function hasPermission(user: any, permission: string) {
  if (!user) return false
  if (user.role === "admin" || user.is_super_user) return true
  return user.permissions && user.permissions.includes(permission)
}
