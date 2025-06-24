export interface Payment {
  id: string
  patientId: string
  patientName: string
  amount: number
  method: "cash" | "card" | "transfer" | "insurance"
  status: "completed" | "pending" | "failed" | "refunded"
  date: string
  time: string
  description: string
  sessionId?: string
  invoiceId?: string
  notes?: string
  processedBy: string
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  patientId: string
  patientName: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  createdBy: string
  createdAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  taxRate: number
}

export interface Budget {
  id: string
  category: string
  budgetAmount: number
  spentAmount: number
  period: "monthly" | "quarterly" | "yearly"
  year: number
  month?: number
  quarter?: number
  status: "active" | "exceeded" | "completed"
  createdAt: string
}

export interface FinancialReport {
  id: string
  title: string
  type: "income" | "expense" | "profit_loss" | "tax" | "budget"
  period: string
  data: any
  generatedAt: string
  generatedBy: string
}

class FinanceDatabase {
  private _payments: Payment[] = [
    {
      id: "pay_001",
      patientId: "pat_001",
      patientName: "Ayşe Yılmaz",
      amount: 350,
      method: "card",
      status: "completed",
      date: "2024-01-15",
      time: "10:30",
      description: "Bireysel terapi seansı",
      sessionId: "ses_001",
      processedBy: "Sekreter Fatma",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "pay_002",
      patientId: "pat_002",
      patientName: "Mehmet Kaya",
      amount: 400,
      method: "cash",
      status: "completed",
      date: "2024-01-15",
      time: "14:00",
      description: "Çift terapisi seansı",
      processedBy: "Sekreter Fatma",
      createdAt: "2024-01-15T14:00:00Z",
    },
    {
      id: "pay_003",
      patientId: "pat_003",
      patientName: "Zeynep Demir",
      amount: 300,
      method: "insurance",
      status: "pending",
      date: "2024-01-15",
      time: "16:30",
      description: "Psikolojik değerlendirme",
      processedBy: "Sekreter Fatma",
      createdAt: "2024-01-15T16:30:00Z",
    },
  ]

  private _invoices: Invoice[] = [
    {
      id: "inv_001",
      invoiceNumber: "INV-2024-001",
      patientId: "pat_001",
      patientName: "Ayşe Yılmaz",
      items: [
        {
          id: "item_001",
          description: "Bireysel Terapi Seansı",
          quantity: 1,
          unitPrice: 350,
          total: 350,
          taxRate: 18,
        },
      ],
      subtotal: 350,
      tax: 63,
      total: 413,
      status: "paid",
      issueDate: "2024-01-15",
      dueDate: "2024-01-30",
      paidDate: "2024-01-15",
      createdBy: "Dr. Ahmet Özkan",
      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: "inv_002",
      invoiceNumber: "INV-2024-002",
      patientId: "pat_002",
      patientName: "Mehmet Kaya",
      items: [
        {
          id: "item_002",
          description: "Çift Terapisi Seansı",
          quantity: 1,
          unitPrice: 400,
          total: 400,
          taxRate: 18,
        },
      ],
      subtotal: 400,
      tax: 72,
      total: 472,
      status: "sent",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      createdBy: "Dr. Ahmet Özkan",
      createdAt: "2024-01-15T14:00:00Z",
    },
  ]

  private _budgets: Budget[] = [
    {
      id: "bud_001",
      category: "Personel Giderleri",
      budgetAmount: 25000,
      spentAmount: 18500,
      period: "monthly",
      year: 2024,
      month: 1,
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "bud_002",
      category: "Kira ve Faturalar",
      budgetAmount: 8000,
      spentAmount: 7200,
      period: "monthly",
      year: 2024,
      month: 1,
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "bud_003",
      category: "Pazarlama",
      budgetAmount: 3000,
      spentAmount: 3200,
      period: "monthly",
      year: 2024,
      month: 1,
      status: "exceeded",
      createdAt: "2024-01-01T00:00:00Z",
    },
  ]

  // Payment operations
  payments = {
    getAll: (): Payment[] => this._payments,
    getById: (id: string): Payment | undefined => this._payments.find((p) => p.id === id),
    getByPatient: (patientId: string): Payment[] => this._payments.filter((p) => p.patientId === patientId),
    getByDate: (date: string): Payment[] => this._payments.filter((p) => p.date === date),
    getByStatus: (status: string): Payment[] => this._payments.filter((p) => p.status === status),
    create: (payment: Omit<Payment, "id" | "createdAt">): Payment => {
      const newPayment: Payment = {
        ...payment,
        id: `pay_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      this._payments.unshift(newPayment)
      return newPayment
    },
    update: (id: string, updates: Partial<Payment>): Payment | null => {
      const index = this._payments.findIndex((p) => p.id === id)
      if (index !== -1) {
        this._payments[index] = { ...this._payments[index], ...updates }
        return this._payments[index]
      }
      return null
    },
    delete: (id: string): boolean => {
      const index = this._payments.findIndex((p) => p.id === id)
      if (index !== -1) {
        this._payments.splice(index, 1)
        return true
      }
      return false
    },
  }

  // Invoice operations
  invoices = {
    getAll: (): Invoice[] => this._invoices,
    getById: (id: string): Invoice | undefined => this._invoices.find((i) => i.id === id),
    getByPatient: (patientId: string): Invoice[] => this._invoices.filter((i) => i.patientId === patientId),
    getByStatus: (status: string): Invoice[] => this._invoices.filter((i) => i.status === status),
    create: (invoice: Omit<Invoice, "id" | "createdAt">): Invoice => {
      const newInvoice: Invoice = {
        ...invoice,
        id: `inv_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      this._invoices.unshift(newInvoice)
      return newInvoice
    },
    update: (id: string, updates: Partial<Invoice>): Invoice | null => {
      const index = this._invoices.findIndex((i) => i.id === id)
      if (index !== -1) {
        this._invoices[index] = { ...this._invoices[index], ...updates }
        return this._invoices[index]
      }
      return null
    },
    delete: (id: string): boolean => {
      const index = this._invoices.findIndex((i) => i.id === id)
      if (index !== -1) {
        this._invoices.splice(index, 1)
        return true
      }
      return false
    },
  }

  // Budget operations
  budgets = {
    getAll: (): Budget[] => this._budgets,
    getById: (id: string): Budget | undefined => this._budgets.find((b) => b.id === id),
    getByPeriod: (period: string, year: number, month?: number): Budget[] => {
      return this._budgets.filter((b) => b.period === period && b.year === year && (!month || b.month === month))
    },
    create: (budget: Omit<Budget, "id" | "createdAt">): Budget => {
      const newBudget: Budget = {
        ...budget,
        id: `bud_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      this._budgets.unshift(newBudget)
      return newBudget
    },
    update: (id: string, updates: Partial<Budget>): Budget | null => {
      const index = this._budgets.findIndex((b) => b.id === id)
      if (index !== -1) {
        this._budgets[index] = { ...this._budgets[index], ...updates }
        return this._budgets[index]
      }
      return null
    },
    delete: (id: string): boolean => {
      const index = this._budgets.findIndex((b) => b.id === id)
      if (index !== -1) {
        this._budgets.splice(index, 1)
        return true
      }
      return false
    },
  }

  // Financial calculations
  calculations = {
    getTotalRevenue: (startDate?: string, endDate?: string): number => {
      let payments = this.payments.getAll().filter((p) => p.status === "completed")
      if (startDate) payments = payments.filter((p) => p.date >= startDate)
      if (endDate) payments = payments.filter((p) => p.date <= endDate)
      return payments.reduce((sum, p) => sum + p.amount, 0)
    },
    getPendingPayments: (): number => {
      return this.payments.getAll().filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
    },
    getOverdueInvoices: (): Invoice[] => {
      const today = new Date().toISOString().split("T")[0]
      return this.invoices.getAll().filter((i) => i.status === "sent" && i.dueDate < today)
    },
    getBudgetUtilization: (categoryId: string): number => {
      const budget = this._budgets.find((b) => b.id === categoryId)
      if (!budget) return 0
      return (budget.spentAmount / budget.budgetAmount) * 100
    },
  }
}

export const FinanceDB = new FinanceDatabase()
