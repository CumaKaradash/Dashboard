"use client"

import { useState, useEffect } from "react"
import { getAuthSession, clearAuthSession, type User } from "@/lib/auth-simple"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authUser = getAuthSession()
    setUser(authUser)
    setLoading(false)
  }, [])

  const logout = () => {
    clearAuthSession()
    setUser(null)
    window.location.href = "/login"
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  }
}
