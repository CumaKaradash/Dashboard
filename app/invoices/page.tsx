"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, FileText, AlertTriangle, CheckCircle, Clock, Download, Eye } from "lucide-react"
import Link from "next/link"
import type { Invoice } from "@/lib/database"
import { DatabaseOperations } from "@/lib/database-operations"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    const allInvoices = DatabaseOperations.invoices.getAll()
    setInvoices(allInvoices)
  }

  const handlePayInvoice = (id: string) => {
    if (confirm("Bu faturayı ödenmiş olarak işaretlemek istediğinizden emin misiniz?")) {
      DatabaseOperations.invoices.update(id, {
        status: "paid",
        paidDate: new Date().toISOString().split("T")[0],
      })
      loadInvoices()
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    alert(
      `Fatura Detayları:\n\nNumara: ${invoice.invoiceNumber}\nTedarikçi: ${invoice.supplier}\nTutar: ₺${invoice.amount.toLocaleString()}\nDurum: ${invoice.status}`,
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ödendi
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Bekliyor
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Gecikmiş</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalAmount: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    paidAmount: invoices.filter((i) => i.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0),
    pendingAmount: invoices.filter((i) => i.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0),
    overdueAmount: invoices.filter((i) => i.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fatura Takibi</h1>
            <p className="text-gray-600">Fatura yönetimi ve ödeme takvimi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor Al
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Fatura
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
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ödenen</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.paidAmount.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-gray-900">₺{stats.pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gecikmiş</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.overdueAmount.toLocaleString()}</p>
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
                    placeholder="Tedarikçi, fatura numarası veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="paid">Ödendi</SelectItem>
                  <SelectItem value="pending">Bekliyor</SelectItem>
                  <SelectItem value="overdue">Gecikmiş</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fatura Listesi</CardTitle>
            <CardDescription>Tüm faturalarınızın detayları ve ödeme durumları</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Fatura No</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tedarikçi</th>
                    <th className="text-left p-4 font-medium text-gray-900">Açıklama</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tutar</th>
                    <th className="text-left p-4 font-medium text-gray-900">Düzenleme</th>
                    <th className="text-left p-4 font-medium text-gray-900">Vade</th>
                    <th className="text-left p-4 font-medium text-gray-900">Durum</th>
                    <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const dueDate = new Date(invoice.dueDate)
                    const today = new Date()
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(invoice.status)}
                            <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{invoice.supplier}</div>
                          <div className="text-sm text-gray-500">{invoice.category}</div>
                        </td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{invoice.description}</td>
                        <td className="p-4">
                          <span className="font-medium text-gray-900">₺{invoice.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-gray-600">{invoice.issueDate}</td>
                        <td className="p-4">
                          <div className="text-gray-600">{invoice.dueDate}</div>
                          {invoice.status === "pending" && (
                            <div
                              className={`text-xs ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 3 ? "text-yellow-600" : "text-gray-500"}`}
                            >
                              {daysUntilDue < 0
                                ? `${Math.abs(daysUntilDue)} gün gecikmiş`
                                : daysUntilDue === 0
                                  ? "Bugün"
                                  : `${daysUntilDue} gün kaldı`}
                            </div>
                          )}
                        </td>
                        <td className="p-4">{getStatusBadge(invoice.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {invoice.status === "pending" && (
                              <Button variant="default" size="sm" onClick={() => handlePayInvoice(invoice.id)}>
                                Öde
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
