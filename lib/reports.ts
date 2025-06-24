import { DatabaseOperations } from "./database"

export interface ReportData {
  title: string
  data: any[]
  summary: Record<string, any>
  generatedAt: string
}

export const ReportGenerator = {
  // Inventory Report
  generateInventoryReport: (): ReportData => {
    const products = DatabaseOperations.products.getAll()
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)
    const lowStockItems = products.filter((p) => p.status === "low").length
    const outOfStockItems = products.filter((p) => p.status === "out").length

    return {
      title: "Envanter Raporu",
      data: products,
      summary: {
        totalProducts: products.length,
        totalValue: totalValue,
        lowStockItems: lowStockItems,
        outOfStockItems: outOfStockItems,
        categories: [...new Set(products.map((p) => p.category))].length,
      },
      generatedAt: new Date().toISOString(),
    }
  },

  // Expense Report
  generateExpenseReport: (startDate?: string, endDate?: string): ReportData => {
    let expenses = DatabaseOperations.expenses.getAll()

    if (startDate && endDate) {
      expenses = expenses.filter((e) => e.date >= startDate && e.date <= endDate)
    }

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)
    const approvedAmount = expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0)
    const pendingAmount = expenses.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0)

    return {
      title: "Gider Raporu",
      data: expenses,
      summary: {
        totalExpenses: expenses.length,
        totalAmount: totalAmount,
        approvedAmount: approvedAmount,
        pendingAmount: pendingAmount,
        categories: [...new Set(expenses.map((e) => e.category))],
      },
      generatedAt: new Date().toISOString(),
    }
  },

  // Appointment Report
  generateAppointmentReport: (date?: string): ReportData => {
    let appointments = DatabaseOperations.appointments.getAll()

    if (date) {
      appointments = appointments.filter((a) => a.date === date)
    }

    const totalRevenue = appointments
      .filter((a) => a.status === "completed" && a.price)
      .reduce((sum, a) => sum + (a.price || 0), 0)

    return {
      title: "Randevu Raporu",
      data: appointments,
      summary: {
        totalAppointments: appointments.length,
        confirmed: appointments.filter((a) => a.status === "confirmed").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
        totalRevenue: totalRevenue,
      },
      generatedAt: new Date().toISOString(),
    }
  },

  // Financial Summary Report
  generateFinancialReport: (): ReportData => {
    const expenses = DatabaseOperations.expenses.getAll()
    const appointments = DatabaseOperations.appointments.getAll()
    const invoices = DatabaseOperations.invoices.getAll()

    const totalExpenses = expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0)
    const totalRevenue = appointments
      .filter((a) => a.status === "completed" && a.price)
      .reduce((sum, a) => sum + (a.price || 0), 0)
    const pendingInvoices = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)

    return {
      title: "Mali Durum Raporu",
      data: {
        expenses: expenses,
        revenue: appointments.filter((a) => a.price),
        invoices: invoices,
      },
      summary: {
        totalRevenue: totalRevenue,
        totalExpenses: totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingInvoices: pendingInvoices,
        profitMargin: totalRevenue > 0 ? (((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(2) : 0,
      },
      generatedAt: new Date().toISOString(),
    }
  },
}

// Export to CSV function
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export to JSON function
export const exportToJSON = (data: any, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
