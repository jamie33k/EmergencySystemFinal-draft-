// Simplified database functions for demo
// In production, replace with actual database calls

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role: string
  phone?: string
}) {
  try {
    // For demo purposes, just return the user data
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return { data: newUser, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function getUserByCredentials(usernameOrEmail: string, password: string) {
  try {
    // Demo users for testing
    const demoUsers = [
      {
        id: "1",
        username: "PeterNjiru",
        email: "peter@example.com",
        password: "PeterNjiru",
        role: "client",
        phone: "+254700000001",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        username: "SashaMunene",
        email: "sasha@example.com",
        password: "SashaMunene",
        role: "responder",
        phone: "+254700000002",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        username: "Admin",
        email: "kipronojamie@gmail.com",
        password: "Admin",
        role: "admin",
        phone: "+254798578853",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const user = demoUsers.find(
      (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password,
    )

    return { data: user || null, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function getAllUsers() {
  try {
    const demoUsers = [
      {
        id: "1",
        username: "PeterNjiru",
        email: "peter@example.com",
        role: "client",
        phone: "+254700000001",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        username: "SashaMunene",
        email: "sasha@example.com",
        role: "responder",
        phone: "+254700000002",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        username: "Admin",
        email: "kipronojamie@gmail.com",
        role: "admin",
        phone: "+254798578853",
        created_at: new Date().toISOString(),
      },
    ]

    return { data: demoUsers, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}
