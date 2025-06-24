import type { UserProfile } from "./user-roles"

export const DEMO_USERS: UserProfile[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@psiklinik.com",
    role: "admin",
    department: "Yönetim",
    permissions: ["all_access"],
    phone: "+90 532 100 0001",
  },
  {
    id: "2",
    name: "Ahmet Tekniker",
    email: "ahmet@psiklinik.com",
    role: "it_manager",
    department: "Bilgi İşlem",
    permissions: ["system_monitoring", "user_management", "technical_reports"],
    phone: "+90 532 100 0002",
  },
  {
    id: "3",
    name: "Elif Sekreter",
    email: "elif@psiklinik.com",
    role: "secretary",
    department: "İdari İşler",
    permissions: ["appointment_management", "patient_registration", "phone_logs"],
    phone: "+90 532 100 0003",
  },
  {
    id: "4",
    name: "Merve Asistan",
    email: "merve@psiklinik.com",
    role: "assistant_psychologist",
    department: "Psikoloji",
    permissions: ["patient_appointments", "session_notes", "basic_assessments"],
    phone: "+90 532 100 0004",
    specialization: "Çocuk Psikolojisi",
  },
  {
    id: "5",
    name: "Dr. Zeynep Kaya",
    email: "zeynep@psiklinik.com",
    role: "psychologist",
    department: "Psikoloji",
    permissions: ["patient_management", "session_records", "psychological_assessments"],
    phone: "+90 532 100 0005",
    specialization: "Anksiyete Bozuklukları",
  },
]

export function validateCredentials(email: string, password: string): UserProfile | null {
  // Demo authentication
  const demoCredentials = [
    { email: "admin@psiklinik.com", password: "admin123" },
    { email: "ahmet@psiklinik.com", password: "ahmet123" },
    { email: "elif@psiklinik.com", password: "elif123" },
    { email: "merve@psiklinik.com", password: "merve123" },
    { email: "zeynep@psiklinik.com", password: "zeynep123" },
  ]

  const credential = demoCredentials.find((c) => c.email === email && c.password === password)
  if (credential) {
    return DEMO_USERS.find((u) => u.email === email) || null
  }

  return null
}

export function setAuthSession(user: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("psiklinik_user", JSON.stringify(user))
    localStorage.setItem("psiklinik_auth", "true")
  }
}

export function getAuthSession(): UserProfile | null {
  if (typeof window !== "undefined") {
    const isAuth = localStorage.getItem("psiklinik_auth")
    const userStr = localStorage.getItem("psiklinik_user")

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
    localStorage.removeItem("psiklinik_user")
    localStorage.removeItem("psiklinik_auth")
  }
}
