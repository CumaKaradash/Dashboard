"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { ProductForm } from "@/components/forms/product-form"
import type { Product } from "@/lib/database"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      loadProducts()
    }
  }

  const handleFormSubmit = async (product: Product) => {
    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
    }
    setShowForm(false)
    loadProducts()
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Yeni Ürün
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Ürün adı veya kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-gray-600">Kategori: {product.category}</div>
              <div className="mb-2 text-sm">Stok: {product.stock} (Min: {product.minStock})</div>
              <div className="mb-2 text-sm">Fiyat: ₺{product.price}</div>
              <div className="mb-2 text-sm">Tedarikçi: {product.supplier}</div>
              <div className="mb-2 text-xs text-gray-500">{product.description}</div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 