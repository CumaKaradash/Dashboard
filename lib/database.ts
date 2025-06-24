// Enhanced database with full CRUD operations
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "employee"
  department?: string
  avatar?: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  supplier: string
  lastUpdated: string
  status: "normal" | "low" | "out"
  description?: string
  image?: string
}

export interface Expense {
  id: string
  description: string
  category: string
  amount: number
  date: string
  status: "approved" | "pending" | "rejected"
  receipt: boolean
  receiptUrl?: string
  submittedBy: string
  approvedBy?: string
  notes?: string
}

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  service: string
  time: string
  date: string
  duration: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  staff: string
  notes?: string
  price?: number
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  position: string
  status: "scheduled" | "completed" | "absent"
  notes?: string
  breakTime?: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  supplier: string
  amount: number
  issueDate: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  category: string
  description: string
  paidDate?: string
  paymentMethod?: string
}

export interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  attendees: string[]
  location: string
  status: "scheduled" | "completed" | "cancelled"
  agenda?: string[]
  notes?: string
  meetingLink?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: string
  userId: string
}

// Enhanced mock data with more realistic entries
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    category: "Elektronik",
    stock: 15,
    minStock: 5,
    price: 25000,
    supplier: "Tech Supplier A",
    lastUpdated: "2024-01-15",
    status: "normal",
    description: "13 inç ekran, Intel i7 işlemci, 16GB RAM",
  },
  {
    id: "2",
    name: "Ofis Sandalyesi",
    category: "Mobilya",
    stock: 3,
    minStock: 10,
    price: 1200,
    supplier: "Mobilya Ltd",
    lastUpdated: "2024-01-14",
    status: "low",
    description: "Ergonomik tasarım, ayarlanabilir yükseklik",
  },
  {
    id: "3",
    name: "A4 Kağıt Paketi",
    category: "Kırtasiye",
    stock: 0,
    minStock: 20,
    price: 45,
    supplier: "Kırtasiye Merkezi",
    lastUpdated: "2024-01-13",
    status: "out",
    description: "500 sayfa, 80gr/m²",
  },
  {
    id: "4",
    name: "Yazıcı HP LaserJet",
    category: "Elektronik",
    stock: 8,
    minStock: 3,
    price: 3500,
    supplier: "Tech Supplier B",
    lastUpdated: "2024-01-12",
    status: "normal",
    description: "Lazer yazıcı, renkli baskı",
  },
]

export const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Ofis Kira Ödemesi",
    category: "Kira",
    amount: 8500,
    date: "2024-01-15",
    status: "approved",
    receipt: true,
    submittedBy: "Admin",
    approvedBy: "Manager",
    notes: "Aylık kira ödemesi",
  },
  {
    id: "2",
    description: "Elektrik Faturası",
    category: "Faturalar",
    amount: 1250,
    date: "2024-01-14",
    status: "pending",
    receipt: true,
    submittedBy: "Muhasebe",
    notes: "Aralık ayı elektrik faturası",
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Ahmet Yılmaz",
    clientPhone: "+90 532 123 4567",
    clientEmail: "ahmet@email.com",
    service: "Saç Kesimi",
    time: "09:00",
    date: "2024-01-15",
    duration: 30,
    status: "confirmed",
    staff: "Mehmet Barber",
    notes: "Kısa kesim tercih ediyor",
    price: 50,
  },
]

export const mockShifts: Shift[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Mehmet Yılmaz",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "17:00",
    position: "Satış Danışmanı",
    status: "scheduled",
    breakTime: 60,
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Ayşe Demir",
    date: "2024-01-15",
    startTime: "13:00",
    endTime: "21:00",
    position: "Kasiyer",
    status: "scheduled",
    breakTime: 30,
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    supplier: "ABC Tedarik Ltd.",
    amount: 15000,
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    status: "pending",
    category: "Malzeme",
    description: "Ofis malzemeleri tedariki",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    supplier: "XYZ Hizmet A.Ş.",
    amount: 3500,
    issueDate: "2024-01-05",
    dueDate: "2024-01-20",
    status: "overdue",
    category: "Hizmet",
    description: "Temizlik hizmeti",
  },
]

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Haftalık Ekip Toplantısı",
    description: "Haftalık performans değerlendirmesi ve hedef belirleme",
    date: "2024-01-16",
    time: "10:00",
    duration: 60,
    attendees: ["Mehmet Yılmaz", "Ayşe Demir", "Can Özkan"],
    location: "Toplantı Salonu A",
    status: "scheduled",
    agenda: ["Geçen hafta performansı", "Yeni hedefler", "Sorun ve çözümler"],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Düşük Stok Uyarısı",
    message: "Ofis Sandalyesi stok seviyesi kritik seviyede (3 adet)",
    type: "warning",
    read: false,
    createdAt: "2024-01-15T10:30:00Z",
    userId: "1",
  },
  {
    id: "2",
    title: "Fatura Vade Uyarısı",
    message: "XYZ Hizmet A.Ş. faturası vadesi geçmiş",
    type: "error",
    read: false,
    createdAt: "2024-01-15T09:15:00Z",
    userId: "1",
  },
  {
    id: "3",
    title: "Yeni Randevu",
    message: "Ahmet Yılmaz için yeni randevu oluşturuldu",
    type: "info",
    read: true,
    createdAt: "2024-01-15T08:45:00Z",
    userId: "1",
  },
]

// CRUD Operations
export const DatabaseOperations = {
  // Products
  products: {
    getAll: () => mockProducts,
    getById: (id: string) => mockProducts.find((p) => p.id === id),
    create: (product: Omit<Product, "id" | "lastUpdated" | "status">) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString().split("T")[0],
        status: product.stock <= product.minStock ? (product.stock === 0 ? "out" : "low") : "normal",
      }
      mockProducts.push(newProduct)
      return newProduct
    },
    update: (id: string, updates: Partial<Product>) => {
      const index = mockProducts.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProducts[index] = {
          ...mockProducts[index],
          ...updates,
          lastUpdated: new Date().toISOString().split("T")[0],
          status:
            updates.stock !== undefined
              ? updates.stock <= (updates.minStock || mockProducts[index].minStock)
                ? updates.stock === 0
                  ? "out"
                  : "low"
                : "normal"
              : mockProducts[index].status,
        }
        return mockProducts[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockProducts.findIndex((p) => p.id === id)
      if (index !== -1) {
        const deleted = mockProducts.splice(index, 1)[0]
        return deleted
      }
      return null
    },
  },

  // Expenses
  expenses: {
    getAll: () => mockExpenses,
    getById: (id: string) => mockExpenses.find((e) => e.id === id),
    create: (expense: Omit<Expense, "id" | "date" | "status">) => {
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        status: "pending",
      }
      mockExpenses.push(newExpense)
      return newExpense
    },
    update: (id: string, updates: Partial<Expense>) => {
      const index = mockExpenses.findIndex((e) => e.id === id)
      if (index !== -1) {
        mockExpenses[index] = { ...mockExpenses[index], ...updates }
        return mockExpenses[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockExpenses.findIndex((e) => e.id === id)
      if (index !== -1) {
        return mockExpenses.splice(index, 1)[0]
      }
      return null
    },
  },

  // Appointments
  appointments: {
    getAll: () => mockAppointments,
    getById: (id: string) => mockAppointments.find((a) => a.id === id),
    create: (appointment: Omit<Appointment, "id" | "status">) => {
      const newAppointment: Appointment = {
        ...appointment,
        id: Date.now().toString(),
        status: "pending",
      }
      mockAppointments.push(newAppointment)
      return newAppointment
    },
    update: (id: string, updates: Partial<Appointment>) => {
      const index = mockAppointments.findIndex((a) => a.id === id)
      if (index !== -1) {
        mockAppointments[index] = { ...mockAppointments[index], ...updates }
        return mockAppointments[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockAppointments.findIndex((a) => a.id === id)
      if (index !== -1) {
        return mockAppointments.splice(index, 1)[0]
      }
      return null
    },
  },

  // Shifts
  shifts: {
    getAll: () => mockShifts,
    getById: (id: string) => mockShifts.find((s) => s.id === id),
    create: (shift: Omit<Shift, "id" | "status">) => {
      const newShift: Shift = {
        ...shift,
        id: Date.now().toString(),
        status: "scheduled",
      }
      mockShifts.push(newShift)
      return newShift
    },
    update: (id: string, updates: Partial<Shift>) => {
      const index = mockShifts.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockShifts[index] = { ...mockShifts[index], ...updates }
        return mockShifts[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockShifts.findIndex((s) => s.id === id)
      if (index !== -1) {
        return mockShifts.splice(index, 1)[0]
      }
      return null
    },
  },

  // Invoices
  invoices: {
    getAll: () => mockInvoices,
    getById: (id: string) => mockInvoices.find((i) => i.id === id),
    create: (invoice: Omit<Invoice, "id">) => {
      const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
      }
      mockInvoices.push(newInvoice)
      return newInvoice
    },
    update: (id: string, updates: Partial<Invoice>) => {
      const index = mockInvoices.findIndex((i) => i.id === id)
      if (index !== -1) {
        mockInvoices[index] = { ...mockInvoices[index], ...updates }
        return mockInvoices[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockInvoices.findIndex((i) => i.id === id)
      if (index !== -1) {
        return mockInvoices.splice(index, 1)[0]
      }
      return null
    },
  },

  // Meetings
  meetings: {
    getAll: () => mockMeetings,
    getById: (id: string) => mockMeetings.find((m) => m.id === id),
    create: (meeting: Omit<Meeting, "id" | "status">) => {
      const newMeeting: Meeting = {
        ...meeting,
        id: Date.now().toString(),
        status: "scheduled",
      }
      mockMeetings.push(newMeeting)
      return newMeeting
    },
    update: (id: string, updates: Partial<Meeting>) => {
      const index = mockMeetings.findIndex((m) => m.id === id)
      if (index !== -1) {
        mockMeetings[index] = { ...mockMeetings[index], ...updates }
        return mockMeetings[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = mockMeetings.findIndex((m) => m.id === id)
      if (index !== -1) {
        return mockMeetings.splice(index, 1)[0]
      }
      return null
    },
  },

  // Notifications
  notifications: {
    getAll: () => mockNotifications,
    getUnread: () => mockNotifications.filter((n) => !n.read),
    markAsRead: (id: string) => {
      const notification = mockNotifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
        return notification
      }
      return null
    },
    markAllAsRead: () => {
      mockNotifications.forEach((n) => (n.read = true))
      return mockNotifications
    },
    create: (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      }
      mockNotifications.unshift(newNotification)
      return newNotification
    },
  },
}
