// Simple authentication without NextAuth
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export const DEMO_USER: User = {
  id: "1",
  email: "admin@bizflow.com",
  name: "Admin User",
  role: "admin",
}

export function validateCredentials(email: string, password: string): User | null {
  if (email === "admin@bizflow.com" && password === "admin123") {
    return DEMO_USER
  }
  return null
}

export function setAuthSession(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bizflow_user", JSON.stringify(user))
    localStorage.setItem("bizflow_auth", "true")
  }
}

export function getAuthSession(): User | null {
  if (typeof window !== "undefined") {
    const isAuth = localStorage.getItem("bizflow_auth")
    const userStr = localStorage.getItem("bizflow_user")

    if (isAuth === "true" && userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bizflow_user")
    localStorage.removeItem("bizflow_auth")
  }
}
