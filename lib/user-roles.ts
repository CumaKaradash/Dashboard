export type UserRole = "admin" | "it_manager" | "secretary" | "assistant_psychologist" | "psychologist"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  permissions: string[]
  avatar?: string
  phone?: string
  specialization?: string // For psychologists
}

export const ROLE_PERMISSIONS = {
  admin: ["all_access", "user_management", "system_settings", "reports_all", "data_export", "finance_management"],
  it_manager: [
    "system_monitoring",
    "user_management",
    "technical_reports",
    "backup_management",
    "security_settings",
    "performance_analytics",
  ],
  secretary: [
    "appointment_management",
    "patient_registration",
    "phone_logs",
    "document_management",
    "calendar_management",
    "basic_reports",
  ],
  assistant_psychologist: [
    "patient_appointments",
    "session_notes",
    "patient_files_basic",
    "supervision_records",
    "basic_assessments",
    "session_scheduling",
  ],
  psychologist: [
    "patient_management",
    "session_records",
    "psychological_assessments",
    "therapy_plans",
    "clinical_reports",
    "supervision_management",
    "patient_files_full",
    "finance_view",
  ],
}

export const ROLE_LABELS = {
  admin: "Sistem Yöneticisi",
  it_manager: "Bilgi İşlem Uzmanı",
  secretary: "Sekreter",
  assistant_psychologist: "Asistan Psikolog",
  psychologist: "Psikolog",
}

export const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-800",
  it_manager: "bg-blue-100 text-blue-800",
  secretary: "bg-green-100 text-green-800",
  assistant_psychologist: "bg-yellow-100 text-yellow-800",
  psychologist: "bg-red-100 text-red-800",
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission) || permissions.includes("all_access")
}

export function getRoleModules(role: UserRole) {
  switch (role) {
    case "admin":
      return [
        "dashboard",
        "user_management",
        "system_settings",
        "reports",
        "patient_management",
        "appointments",
        "sessions",
        "documents",
        "finance",
      ]
    case "it_manager":
      return [
        "dashboard",
        "system_monitoring",
        "user_management",
        "technical_reports",
        "backup_management",
        "security_settings",
        "performance_analytics",
      ]
    case "secretary":
      return [
        "dashboard",
        "appointments",
        "patient_registration",
        "phone_logs",
        "documents",
        "calendar",
        "basic_reports",
      ]
    case "assistant_psychologist":
      return ["dashboard", "appointments", "sessions", "patient_files", "supervision", "assessments", "scheduling"]
    case "psychologist":
      return [
        "dashboard",
        "patient_management",
        "sessions",
        "assessments",
        "therapy_plans",
        "reports",
        "supervision",
        "calendar",
        "finance",
      ]
    default:
      return ["dashboard"]
  }
}
