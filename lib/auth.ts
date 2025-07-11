import type { User } from "./types"

export async function signIn(
  usernameOrEmail: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    console.log("=== CLIENT SIGN IN ===")
    console.log("Attempting sign in for:", usernameOrEmail)
    console.log("Password provided:", password ? "Yes" : "No")

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", response.headers.get("content-type"))

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      return { user: null, error: "Server error - please try again later" }
    }

    const data = await response.json()
    console.log("Sign in response data:", data)

    if (!response.ok) {
      console.error("Sign in failed:", data.error)
      return { user: null, error: data.error || "Login failed" }
    }

    // Store user in localStorage for session management
    if (typeof window !== "undefined") {
      localStorage.setItem("huduma_user", JSON.stringify(data.user))
      console.log("User stored in localStorage:", data.user.username)
    }

    console.log("=== CLIENT SIGN IN SUCCESS ===")
    return { user: data.user, error: null }
  } catch (error) {
    console.error("Sign in client error:", error)
    return { user: null, error: "Network error - please check your connection" }
  }
}

export async function signUp(userData: {
  username: string
  email: string
  password: string
  phone: string
  role: "client" | "responder"
}): Promise<{ user: User | null; error: string | null }> {
  try {
    console.log("=== CLIENT SIGN UP ===")
    console.log("Attempting sign up for:", userData.username)

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    console.log("Response status:", response.status)

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      return { user: null, error: "Server error - please try again later" }
    }

    const data = await response.json()
    console.log("Sign up response data:", data)

    if (!response.ok) {
      console.error("Sign up failed:", data.error)
      return { user: null, error: data.error || "Sign up failed" }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("huduma_user", JSON.stringify(data.user))
      console.log("User stored in localStorage:", data.user.username)
    }

    console.log("=== CLIENT SIGN UP SUCCESS ===")
    return { user: data.user, error: null }
  } catch (error) {
    console.error("Sign up client error:", error)
    return { user: null, error: "Network error - please check your connection" }
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("huduma_user")
    if (!userStr) {
      console.log("No user found in localStorage")
      return null
    }

    const user = JSON.parse(userStr)
    console.log("Retrieved user from localStorage:", user.username)
    return user
  } catch (error) {
    console.error("Error retrieving user from localStorage:", error)
    localStorage.removeItem("huduma_user")
    return null
  }
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("huduma_user")
    console.log("User signed out and removed from localStorage")
  }
}
