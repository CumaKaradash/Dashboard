"use client"

import { useState, useEffect } from "react"
import { getAuthSession, clearAuthSession, type UserProfile } from "@/lib/auth-psychology"

export function usePsychologyAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
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
    hasRole: (role: string) => user?.role === role,
    hasPermission: (permission: string) =>
      user?.permissions.includes(permission) || user?.permissions.includes("all_access"),
  }
}
