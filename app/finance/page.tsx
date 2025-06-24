"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { FinanceDB, type Payment, type Invoice, type Budget } from "@/lib/finance-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"
import BudgetForm from "@/components/forms/budget-form"

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    setLoading(true)
    try {
      // Payments API'den çekiliyor
      const paymentsRes = await fetch("/api/payments")
      const allPayments = await paymentsRes.json()
      // Invoices API'den çekiliyor
      const invoicesRes = await fetch("/api/invoices")
      const allInvoices = await invoicesRes.json()
      // Budgets API'den çekiliyor
      const budgetsRes = await fetch("/api/budgets")
      const allBudgets = await budgetsRes.json()
      setPayments(allPayments)
      setInvoices(allInvoices)
      setBudgets(allBudgets)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Finans verileri yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = () => {
    setShowPaymentForm(true)
  }

  const handleAddInvoice = () => {
    setShowInvoiceForm(true)
  }

  const handleDeletePayment = (id: string) => {
    if (confirm("Bu ödeme kaydını silmek istediğinizden emin misiniz?")) {
      try {
        FinanceDB.payments.delete(id)
        loadFinanceData()
        toast({
          title: "Başarılı",
          description: "Ödeme kaydı silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Ödeme kaydı silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (confirm("Bu bütçe kaydını silmek istediğinizden emin misiniz?")) {
      try {
        const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" })
        if (res.ok) {
          loadFinanceData()
          toast({ title: "Başarılı", description: "Bütçe kaydı silindi" })
        } else {
          toast({ title: "Hata", description: "Bütçe silinemedi", variant: "destructive" })
        }
      } catch {
        toast({ title: "Hata", description: "Sunucu hatası", variant: "destructive" })
      }
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      cash: "bg-green-100 text-green-800",
      card: "bg-blue-100 text-blue-800",
      transfer: "bg-purple-100 text-purple-800",
      insurance: "bg-orange-100 text-orange-800",
    }
    const labels = {
      cash: "Nakit",
      card: "Kart",
      transfer: "Havale",
      insurance: "Sigorta",
    }
    return (
      <Badge className={colors[method as keyof typeof colors] || colors.cash}>
        {labels[method as keyof typeof labels] || method}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Bekliyor</Badge>
      case "failed":
        return <Badge variant="destructive">Başarısız</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Ödendi</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Gönderildi</Badge>
      case "overdue":
        return <Badge variant="destructive">Vadesi Geçti</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Taslak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getBudgetStatus = (budget: Budget) => {
    const utilization = (budget.spentAmount / budget.budgetAmount) * 100
    if (utilization > 100) return { color: "text-red-600", icon: AlertTriangle, text: "Aşıldı" }
    if (utilization > 80) return { color: "text-yellow-600", icon: AlertTriangle, text: "Dikkat" }
    return { color: "text-green-600", icon: CheckCircle, text: "Normal" }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate statistics
  const totalRevenue = FinanceDB.calculations.getTotalRevenue()
  const pendingPayments = FinanceDB.calculations.getPendingPayments()
  const overdueInvoices = FinanceDB.calculations.getOverdueInvoices()
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0)

  const handleAddBudget = async (budgetData?: any) => {
    setShowBudgetForm(true)
    if (budgetData) {
      try {
        const res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(budgetData),
        })
        if (res.ok) {
          loadFinanceData()
          toast({ title: "Başarılı", description: "Bütçe eklendi" })
        } else {
          toast({ title: "Hata", description: "Bütçe eklenemedi", variant: "destructive" })
        }
      } catch {
        toast({ title: "Hata", description: "Sunucu hatası", variant: "destructive" })
      }
      setShowBudgetForm(false)
    }
  }

  if (!hasPermission("finance_management") && !hasPermission("finance_view")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Erişim Yetkisi Yok</h2>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Finans verileri yükleniyor...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Finans Yönetimi</h1>
            <p className="text-gray-600">Gelir, gider ve mali durum takibi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor Al
            </Button>
            {hasPermission("finance_management") && (
              <>
                <Button variant="outline" size="sm" onClick={handleAddInvoice}>
                  <FileText className="w-4 h-4 mr-2" />
                  Fatura Oluştur
                </Button>
                <Button size="sm" onClick={handleAddPayment}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ödeme Ekle
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-gray-900">₺{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen Ödeme</p>
                  <p className="text-2xl font-bold text-gray-900">₺{pendingPayments.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueInvoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bütçe Kullanımı</p>
                  <p className="text-2xl font-bold text-gray-900">%{((totalSpent / totalBudget) * 100).toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Hasta adı, fatura numarası veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="payments">Ödemeler</TabsTrigger>
            <TabsTrigger value="invoices">Faturalar</TabsTrigger>
            <TabsTrigger value="budget">Bütçe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Payments */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Ödemeler</CardTitle>
                  <CardDescription>En son alınan ödemeler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{payment.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {payment.date} - {payment.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₺{payment.amount.toLocaleString()}</p>
                          {getPaymentMethodBadge(payment.method)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Bütçe Durumu</CardTitle>
                  <CardDescription>Kategori bazlı bütçe kullanımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.map((budget) => {
                      const utilization = (budget.spentAmount / budget.budgetAmount) * 100
                      const status = getBudgetStatus(budget)
                      const StatusIcon = status.icon
                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{budget.category}</span>
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`w-4 h-4 ${status.color}`} />
                              <span className={`text-sm ${status.color}`}>{status.text}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                utilization > 100 ? "bg-red-500" : utilization > 80 ? "bg-yellow-500" : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>₺{budget.spentAmount.toLocaleString()}</span>
                            <span>₺{budget.budgetAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Listesi</CardTitle>
                <CardDescription>Tüm ödeme kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hasta</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Yöntem</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.patientName}</TableCell>
                        <TableCell>₺{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{getPaymentMethodBadge(payment.method)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.date} {payment.time}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{payment.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission("finance_management") && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeletePayment(payment.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fatura Listesi</CardTitle>
                <CardDescription>Tüm fatura kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura No</TableHead>
                      <TableHead>Hasta</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Düzenleme</TableHead>
                      <TableHead>Vade</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.patientName}</TableCell>
                        <TableCell>₺{invoice.total.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{invoice.issueDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission("finance_management") && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bütçe Yönetimi</CardTitle>
                <CardDescription>Kategori bazlı bütçe takibi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {budgets.map((budget) => {
                    const utilization = (budget.spentAmount / budget.budgetAmount) * 100
                    const status = getBudgetStatus(budget)
                    const StatusIcon = status.icon
                    return (
                      <Card key={budget.id}>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{budget.category}</h3>
                              <StatusIcon className={`w-5 h-5 ${status.color}`} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Kullanılan</span>
                                <span>₺{budget.spentAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Bütçe</span>
                                <span>₺{budget.budgetAmount.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    utilization > 100
                                      ? "bg-red-500"
                                      : utilization > 80
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-center text-sm font-medium">
                                %{utilization.toFixed(1)} kullanıldı
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Ödeme Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Hasta</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Hasta seçin</option>
                  <option value="pat_001">Ayşe Yılmaz</option>
                  <option value="pat_002">Mehmet Kaya</option>
                  <option value="pat_003">Zeynep Demir</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Tutar (₺)</label>
                <Input type="number" placeholder="350" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ödeme Yöntemi</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="cash">Nakit</option>
                  <option value="card">Kart</option>
                  <option value="transfer">Havale</option>
                  <option value="insurance">Sigorta</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="completed">Tamamlandı</option>
                  <option value="pending">Bekliyor</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Açıklama</label>
              <Input placeholder="Ödeme açıklaması" />
            </div>
            <div>
              <label className="text-sm font-medium">Notlar</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Ek notlar..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowPaymentForm(false)}>Kaydet</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Form Dialog */}
      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Yeni Fatura Oluştur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Hasta</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Hasta seçin</option>
                  <option value="pat_001">Ayşe Yılmaz</option>
                  <option value="pat_002">Mehmet Kaya</option>
                  <option value="pat_003">Zeynep Demir</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Vade Tarihi</label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Fatura Kalemleri</label>
              <div className="border rounded-md p-4 space-y-3">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                  <span>Açıklama</span>
                  <span>Miktar</span>
                  <span>Birim Fiyat</span>
                  <span>Toplam</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input placeholder="Hizmet açıklaması" />
                  <Input type="number" placeholder="1" />
                  <Input type="number" placeholder="350" />
                  <Input placeholder="350" disabled />
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Kalem Ekle
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Ara Toplam</label>
                <Input placeholder="350" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">KDV (%18)</label>
                <Input placeholder="63" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Genel Toplam</label>
                <Input placeholder="413" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notlar</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Fatura notları..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInvoiceForm(false)}>
                İptal
              </Button>
              <Button variant="outline">Taslak Kaydet</Button>
              <Button onClick={() => setShowInvoiceForm(false)}>Oluştur ve Gönder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Budget Form Dialog */}
      <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Bütçe Ekle</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={async (data) => {
              await handleAddBudget(data)
            }}
            onCancel={() => setShowBudgetForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
