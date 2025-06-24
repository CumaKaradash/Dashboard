export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  referralSource?: string
  primaryPsychologist: string
  status: "active" | "inactive" | "discharged"
  registrationDate: string
  notes?: string
  medicalHistory?: string
  currentMedications?: string
}

export interface Session {
  id: string
  patientId: string
  psychologistId: string
  date: string
  startTime: string
  endTime: string
  type: "individual" | "group" | "family" | "assessment"
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  interventions?: string[]
  homework?: string
  nextSessionPlan?: string
  mood?: number // 1-10 scale
  progress?: string
  duration: number
}

export interface Assessment {
  id: string
  patientId: string
  psychologistId: string
  type: string
  date: string
  results: Record<string, any>
  interpretation: string
  recommendations: string[]
  status: "draft" | "completed" | "reviewed"
}

export interface TherapyPlan {
  id: string
  patientId: string
  psychologistId: string
  goals: string[]
  interventions: string[]
  timeline: string
  reviewDate: string
  status: "active" | "completed" | "modified"
  createdDate: string
  progress?: string
}

export interface PhoneLog {
  id: string
  date: string
  time: string
  callerName: string
  callerPhone: string
  purpose: string
  message: string
  takenBy: string
  followUpRequired: boolean
  status: "pending" | "completed"
}

export interface Document {
  id: string
  title: string
  type: "consent" | "assessment" | "report" | "correspondence" | "other"
  patientId?: string
  uploadedBy: string
  uploadDate: string
  fileUrl: string
  description?: string
  tags: string[]
}

// Mock data
export const mockPatients: Patient[] = [
  {
    id: "1",
    firstName: "Ayşe",
    lastName: "Yılmaz",
    dateOfBirth: "1985-03-15",
    gender: "female",
    phone: "+90 532 123 4567",
    email: "ayse.yilmaz@email.com",
    address: "İstanbul, Kadıköy",
    emergencyContact: {
      name: "Mehmet Yılmaz",
      phone: "+90 532 123 4568",
      relationship: "Eş",
    },
    referralSource: "Aile Hekimi",
    primaryPsychologist: "Dr. Zeynep Kaya",
    status: "active",
    registrationDate: "2024-01-10",
    notes: "Anksiyete bozukluğu tedavisi",
    medicalHistory: "Hipertansiyon",
    currentMedications: "Sertralin 50mg",
  },
  {
    id: "2",
    firstName: "Can",
    lastName: "Demir",
    dateOfBirth: "1992-07-22",
    gender: "male",
    phone: "+90 533 987 6543",
    email: "can.demir@email.com",
    emergencyContact: {
      name: "Fatma Demir",
      phone: "+90 533 987 6544",
      relationship: "Anne",
    },
    primaryPsychologist: "Dr. Ahmet Özkan",
    status: "active",
    registrationDate: "2024-01-05",
    notes: "Depresyon tedavisi",
  },
]

export const mockSessions: Session[] = [
  {
    id: "1",
    patientId: "1",
    psychologistId: "dr-zeynep-kaya",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "10:50",
    type: "individual",
    status: "completed",
    notes: "Hasta anksiyete seviyesinde azalma bildirdi. Nefes egzersizleri etkili olmuş.",
    interventions: ["Bilişsel Yeniden Yapılandırma", "Nefes Egzersizleri"],
    homework: "Günlük düşünce kaydı tutmaya devam",
    mood: 6,
    progress: "İyi",
    duration: 50,
  },
  {
    id: "2",
    patientId: "2",
    psychologistId: "dr-ahmet-ozkan",
    date: "2024-01-16",
    startTime: "14:00",
    endTime: "14:50",
    type: "individual",
    status: "scheduled",
    duration: 50,
  },
]

export const mockAssessments: Assessment[] = [
  {
    id: "1",
    patientId: "1",
    psychologistId: "dr-zeynep-kaya",
    type: "Beck Anksiyete Envanteri",
    date: "2024-01-10",
    results: {
      totalScore: 28,
      severity: "Orta",
    },
    interpretation: "Orta düzeyde anksiyete belirtileri mevcut",
    recommendations: ["Bilişsel davranışçı terapi", "Gevşeme teknikleri"],
    status: "completed",
  },
]

export const mockTherapyPlans: TherapyPlan[] = [
  {
    id: "1",
    patientId: "1",
    psychologistId: "dr-zeynep-kaya",
    goals: ["Anksiyete seviyesini azaltmak", "Başa çıkma stratejileri geliştirmek", "Sosyal işlevselliği artırmak"],
    interventions: ["Bilişsel Davranışçı Terapi", "Gevşeme Teknikleri", "Maruz Bırakma Terapisi"],
    timeline: "12 hafta",
    reviewDate: "2024-04-15",
    status: "active",
    createdDate: "2024-01-10",
    progress: "Hedeflerin %60'ı gerçekleştirildi",
  },
]

export const mockPhoneLogs: PhoneLog[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "09:30",
    callerName: "Ayşe Yılmaz",
    callerPhone: "+90 532 123 4567",
    purpose: "Randevu değişikliği",
    message: "Yarınki randevusunu ertelemek istiyor",
    takenBy: "Sekreter Elif",
    followUpRequired: true,
    status: "pending",
  },
  {
    id: "2",
    date: "2024-01-15",
    time: "11:15",
    callerName: "Mehmet Kaya",
    callerPhone: "+90 533 456 7890",
    purpose: "Bilgi alma",
    message: "Terapi ücretleri hakkında bilgi aldı",
    takenBy: "Sekreter Elif",
    followUpRequired: false,
    status: "completed",
  },
]

export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Bilgilendirilmiş Onam Formu",
    type: "consent",
    patientId: "1",
    uploadedBy: "Sekreter Elif",
    uploadDate: "2024-01-10",
    fileUrl: "/documents/consent-ayse-yilmaz.pdf",
    description: "Ayşe Yılmaz için imzalanmış onam formu",
    tags: ["onam", "yasal"],
  },
  {
    id: "2",
    title: "İlk Değerlendirme Raporu",
    type: "assessment",
    patientId: "1",
    uploadedBy: "Dr. Zeynep Kaya",
    uploadDate: "2024-01-12",
    fileUrl: "/documents/assessment-ayse-yilmaz.pdf",
    description: "Başlangıç değerlendirme raporu",
    tags: ["değerlendirme", "rapor"],
  },
]

// Database operations
export const PsychologyDatabase = {
  patients: {
    getAll: () => mockPatients,
    getById: (id: string) => mockPatients.find((p) => p.id === id),
    getByPsychologist: (psychologistId: string) => mockPatients.filter((p) => p.primaryPsychologist === psychologistId),
    create: (patient: Omit<Patient, "id" | "registrationDate">) => {
      const newPatient: Patient = {
        ...patient,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString().split("T")[0],
      }
      mockPatients.push(newPatient)
      return newPatient
    },
    update: (id: string, updates: Partial<Patient>) => {
      const index = mockPatients.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockPatients[index] = { ...mockPatients[index], ...updates }
        return mockPatients[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockPatients.findIndex((p) => p.id === id)
      if (index !== -1) {
        return mockPatients.splice(index, 1)[0]
      }
      return null
    },
  },

  sessions: {
    getAll: () => mockSessions,
    getById: (id: string) => mockSessions.find((s) => s.id === id),
    getByPatient: (patientId: string) => mockSessions.filter((s) => s.patientId === patientId),
    getByPsychologist: (psychologistId: string) => mockSessions.filter((s) => s.psychologistId === psychologistId),
    getByDate: (date: string) => mockSessions.filter((s) => s.date === date),
    create: (session: Omit<Session, "id">) => {
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
      }
      mockSessions.push(newSession)
      return newSession
    },
    update: (id: string, updates: Partial<Session>) => {
      const index = mockSessions.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockSessions[index] = { ...mockSessions[index], ...updates }
        return mockSessions[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockSessions.findIndex((s) => s.id === id)
      if (index !== -1) {
        return mockSessions.splice(index, 1)[0]
      }
      return null
    },
  },

  assessments: {
    getAll: () => mockAssessments,
    getById: (id: string) => mockAssessments.find((a) => a.id === id),
    getByPatient: (patientId: string) => mockAssessments.filter((a) => a.patientId === patientId),
    create: (assessment: Omit<Assessment, "id">) => {
      const newAssessment: Assessment = {
        ...assessment,
        id: Date.now().toString(),
      }
      mockAssessments.push(newAssessment)
      return newAssessment
    },
    update: (id: string, updates: Partial<Assessment>) => {
      const index = mockAssessments.findIndex((a) => a.id === id)
      if (index !== -1) {
        mockAssessments[index] = { ...mockAssessments[index], ...updates }
        return mockAssessments[index]
      }
      return null
    },
  },

  therapyPlans: {
    getAll: () => mockTherapyPlans,
    getById: (id: string) => mockTherapyPlans.find((t) => t.id === id),
    getByPatient: (patientId: string) => mockTherapyPlans.filter((t) => t.patientId === patientId),
    create: (plan: Omit<TherapyPlan, "id" | "createdDate">) => {
      const newPlan: TherapyPlan = {
        ...plan,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split("T")[0],
      }
      mockTherapyPlans.push(newPlan)
      return newPlan
    },
    update: (id: string, updates: Partial<TherapyPlan>) => {
      const index = mockTherapyPlans.findIndex((t) => t.id === id)
      if (index !== -1) {
        mockTherapyPlans[index] = { ...mockTherapyPlans[index], ...updates }
        return mockTherapyPlans[index]
      }
      return null
    },
  },

  phoneLogs: {
    getAll: () => mockPhoneLogs,
    getById: (id: string) => mockPhoneLogs.find((p) => p.id === id),
    getByDate: (date: string) => mockPhoneLogs.filter((p) => p.date === date),
    create: (log: Omit<PhoneLog, "id">) => {
      const newLog: PhoneLog = {
        ...log,
        id: Date.now().toString(),
      }
      mockPhoneLogs.push(newLog)
      return newLog
    },
    update: (id: string, updates: Partial<PhoneLog>) => {
      const index = mockPhoneLogs.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockPhoneLogs[index] = { ...mockPhoneLogs[index], ...updates }
        return mockPhoneLogs[index]
      }
      return null
    },
  },

  documents: {
    getAll: () => mockDocuments,
    getById: (id: string) => mockDocuments.find((d) => d.id === id),
    getByPatient: (patientId: string) => mockDocuments.filter((d) => d.patientId === patientId),
    getByType: (type: string) => mockDocuments.filter((d) => d.type === type),
    create: (document: Omit<Document, "id" | "uploadDate">) => {
      const newDocument: Document = {
        ...document,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString().split("T")[0],
      }
      mockDocuments.push(newDocument)
      return newDocument
    },
    update: (id: string, updates: Partial<Document>) => {
      const index = mockDocuments.findIndex((d) => d.id === id)
      if (index !== -1) {
        mockDocuments[index] = { ...mockDocuments[index], ...updates }
        return mockDocuments[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockDocuments.findIndex((d) => d.id === id)
      if (index !== -1) {
        return mockDocuments.splice(index, 1)[0]
      }
      return null
    },
  },
}
