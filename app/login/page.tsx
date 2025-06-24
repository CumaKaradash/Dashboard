"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Lock } from "lucide-react"
import { validateCredentials, setAuthSession, getAuthSession } from "@/lib/auth-psychology"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@psiklinik.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const demoUsers = [
    { email: "admin@psiklinik.com", password: "admin123", name: "Admin User", role: "Sistem Yöneticisi" },
    { email: "ahmet@psiklinik.com", password: "ahmet123", name: "Ahmet Tekniker", role: "Bilgi İşlem Uzmanı" },
    { email: "elif@psiklinik.com", password: "elif123", name: "Elif Sekreter", role: "Sekreter" },
    { email: "merve@psiklinik.com", password: "merve123", name: "Merve Asistan", role: "Asistan Psikolog" },
    { email: "zeynep@psiklinik.com", password: "zeynep123", name: "Dr. Zeynep Kaya", role: "Psikolog" },
  ]

  // Check if already logged in
  useEffect(() => {
    const user = getAuthSession()
    if (user) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = validateCredentials(email, password)

      if (user) {
        setAuthSession(user)
        router.push("/")
      } else {
        setError("Geçersiz email veya şifre")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Giriş yapılırken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">PsiKlinik</CardTitle>
          <CardDescription>Psikoloji Kliniği Yönetim Sistemi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@psiklinik.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Hesaplar:</p>
            {demoUsers.map((user, index) => (
              <div key={index} className="text-xs text-blue-700 mb-1">
                <strong>{user.role}:</strong> {user.email} / {user.password}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
