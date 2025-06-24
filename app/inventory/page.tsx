"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ProductForm } from "@/components/forms/product-form"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Package, AlertTriangle, TrendingDown, Filter, Download, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DatabaseOperations, type Product } from "@/lib/database"
import { ReportGenerator, exportToCSV } from "@/lib/reports"
import { useSearchParams } from "next/navigation"

function InventoryContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const searchParams = useSearchParams()

  useEffect(() => {
    loadProducts()

    // Check if we should open the add form
    if (searchParams.get("action") === "add") {
      setShowForm(true)
    }
  }, [searchParams])

  const loadProducts = () => {
    const allProducts = DatabaseOperations.products.getAll()
    setProducts(allProducts)
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      DatabaseOperations.products.delete(id)
      loadProducts()
    }
  }

  const handleFormSubmit = (product: Product) => {
    setShowForm(false)
    setEditingProduct(undefined)
    loadProducts()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProduct(undefined)
  }

  const handleExportReport = () => {
    const report = ReportGenerator.generateInventoryReport()
    exportToCSV(report.data, "envanter-raporu")
  }

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "out":
        return <Badge variant="destructive">Stokta Yok</Badge>
      case "low":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Düşük Stok
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        )
    }
  }

  const filteredItems = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalItems: products.length,
    lowStock: products.filter((item) => item.status === "low").length,
    outOfStock: products.filter((item) => item.status === "out").length,
    totalValue: products.reduce((sum, item) => sum + item.stock * item.price, 0),
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
            <h1 className="text-2xl font-bold text-gray-900">Envanter Yönetimi</h1>
            <p className="text-gray-600">Stok takibi ve tedarikçi yönetimi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button size="sm" onClick={handleAddProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ürün
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
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Stokta Yok</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.totalValue.toLocaleString()}</p>
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
                    placeholder="Ürün adı veya kategori ara..."
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

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ürün Listesi</CardTitle>
            <CardDescription>Tüm ürünlerinizin stok durumu ve detayları</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Ürün Adı</th>
                    <th className="text-left p-4 font-medium text-gray-900">Kategori</th>
                    <th className="text-left p-4 font-medium text-gray-900">Stok</th>
                    <th className="text-left p-4 font-medium text-gray-900">Min. Stok</th>
                    <th className="text-left p-4 font-medium text-gray-900">Fiyat</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tedarikçi</th>
                    <th className="text-left p-4 font-medium text-gray-900">Durum</th>
                    <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">Son güncelleme: {item.lastUpdated}</div>
                      </td>
                      <td className="p-4 text-gray-600">{item.category}</td>
                      <td className="p-4">
                        <span
                          className={`font-medium ${
                            item.stock === 0
                              ? "text-red-600"
                              : item.stock <= item.minStock
                                ? "text-yellow-600"
                                : "text-gray-900"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{item.minStock}</td>
                      <td className="p-4 text-gray-900">₺{item.price.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">{item.supplier}</td>
                      <td className="p-4">{getStatusBadge(item.status, item.stock)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(item.id)}>
                            <Trash2 className="w-4 h-4" />
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

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
          </DialogHeader>
          <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <AuthGuard>
      <InventoryContent />
    </AuthGuard>
  )
}
