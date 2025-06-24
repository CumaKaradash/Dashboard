import { DatabaseOperations as DB } from "./database"

// Re-export all database operations for consistency
export const DatabaseOperations = {
  ...DB,

  // Additional utility functions
  search: {
    products: (query: string) => {
      return DB.products
        .getAll()
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.supplier.toLowerCase().includes(query.toLowerCase()),
        )
    },
    expenses: (query: string) => {
      return DB.expenses
        .getAll()
        .filter(
          (expense) =>
            expense.description.toLowerCase().includes(query.toLowerCase()) ||
            expense.category.toLowerCase().includes(query.toLowerCase()) ||
            expense.submittedBy.toLowerCase().includes(query.toLowerCase()),
        )
    },
    appointments: (query: string) => {
      return DB.appointments
        .getAll()
        .filter(
          (appointment) =>
            appointment.clientName.toLowerCase().includes(query.toLowerCase()) ||
            appointment.service.toLowerCase().includes(query.toLowerCase()) ||
            appointment.staff.toLowerCase().includes(query.toLowerCase()),
        )
    },
  },

  // Bulk operations
  bulk: {
    updateProductStatus: () => {
      const products = DB.products.getAll()
      products.forEach((product) => {
        const newStatus = product.stock <= product.minStock ? (product.stock === 0 ? "out" : "low") : "normal"
        if (newStatus !== product.status) {
          DB.products.update(product.id, { status: newStatus })
        }
      })
    },

    checkOverdueInvoices: () => {
      const invoices = DB.invoices.getAll()
      const today = new Date()

      invoices.forEach((invoice) => {
        if (invoice.status === "pending") {
          const dueDate = new Date(invoice.dueDate)
          if (dueDate < today) {
            DB.invoices.update(invoice.id, { status: "overdue" })
          }
        }
      })
    },
  },
}
