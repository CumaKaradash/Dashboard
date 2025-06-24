"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Receipt,
  Clock,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { ExpenseForm } from "@/components/forms/expense-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DatabaseOperations, type Expense } from "@/lib/database"
import { useSearchParams } from "next/navigation"

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>()
  const searchParams = useSearchParams()

  useEffect(() => {
    loadExpenses()
    if (searchParams.get("action") === "add") {
      setShowForm(true)
    }
  }, [searchParams])

  const loadExpenses = () => {
    const allExpenses = DatabaseOperations.expenses.getAll()
    setExpenses(allExpenses)
  }

  const handleAddExpense = () => {
    setEditingExpense(undefined)
    setShowForm(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDeleteExpense = (id: string) => {
    if (confirm("Bu gideri silmek istediğinizden emin misiniz?")) {
      DatabaseOperations.expenses.delete(id)
      loadExpenses()
    }
  }

  const handleFormSubmit = (expense: Expense) => {
    setShowForm(false)
    setEditingExpense(undefined)
    loadExpenses()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingExpense(undefined)
  }

  const handleStatusUpdate = (id: string, status: string) => {
    DatabaseOperations.expenses.update(id, { status })
    loadExpenses()
  }

  const categories = ["Kira", "Faturalar", "Ofis Malzemeleri", "Yemek", "Teknoloji", "Ulaşım", "Pazarlama"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Onaylandı
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Bekliyor
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    approvedExpenses: expenses.filter((e) => e.status === "approved").reduce((sum, expense) => sum + expense.amount, 0),
    pendingExpenses: expenses.filter((e) => e.status === "pending").reduce((sum, expense) => sum + expense.amount, 0),
    thisMonthExpenses: expenses.length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Gider Yönetimi</h1>
            <p className="text-gray-600">Gider takibi ve onay süreçleri</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor Al
            </Button>
            <Button size="sm" onClick={handleAddExpense}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Gider
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.approvedExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.pendingExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthExpenses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Gider açıklaması ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Kategori seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gider Listesi</CardTitle>
            <CardDescription>Tüm giderlerinizin detayları ve onay durumları</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Açıklama</th>
                    <th className="text-left p-4 font-medium text-gray-900">Kategori</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tutar</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tarih</th>
                    <th className="text-left p-4 font-medium text-gray-900">Gönderen</th>
                    <th className="text-left p-4 font-medium text-gray-900">Makbuz</th>
                    <th className="text-left p-4 font-medium text-gray-900">Durum</th>
                    <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{expense.description}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{expense.category}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">₺{expense.amount.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-gray-600">{expense.date}</td>
                      <td className="p-4 text-gray-600">{expense.submittedBy}</td>
                      <td className="p-4">
                        {expense.receipt ? (
                          <Receipt className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(expense.status)}
                          <Select
                            value={expense.status}
                            onValueChange={(value) => handleStatusUpdate(expense.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Durum Seç" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Bekliyor</SelectItem>
                              <SelectItem value="approved">Onaylandı</SelectItem>
                              <SelectItem value="rejected">Reddedildi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpense ? "Gideri Düzenle" : "Yeni Gider Ekle"}</DialogTitle>
          </DialogHeader>
          <ExpenseForm expense={editingExpense} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
