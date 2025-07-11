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
  },
]

// In-memory storage for emergency requests
export const emergencyRequests: any[] = []

// Helper function to find user by credentials
export function findUserByCredentials(usernameOrEmail: string, password: string) {
  console.log("Looking for user:", { usernameOrEmail, password })
  console.log(
    "Available users:",
    DEMO_USERS.map((u) => ({ username: u.username, email: u.email })),
  )

  const user = DEMO_USERS.find((u) => {
    const matchesUsername = u.username.toLowerCase() === usernameOrEmail.toLowerCase()
    const matchesEmail = u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    const matchesPassword = u.password === password

    console.log(`Checking user ${u.username}:`, {
      matchesUsername,
      matchesEmail,
      matchesPassword,
      inputPassword: password,
      userPassword: u.password,
    })

    return (matchesUsername || matchesEmail) && matchesPassword
  })

  console.log("Found user:", user ? user.username : "none")
  return user
}

// Helper function to get user by ID
export function findUserById(id: string) {
  return DEMO_USERS.find((u) => u.id === id)
}
