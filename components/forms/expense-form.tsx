"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatabaseOperations, type Expense } from "@/lib/database"

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (expense: Expense) => void
  onCancel: () => void
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    category: expense?.category || "",
    amount: expense?.amount || 0,
    receipt: expense?.receipt || false,
    submittedBy: expense?.submittedBy || "Admin",
    notes: expense?.notes || "",
  })

  const [loading, setLoading] = useState(false)

  const categories = ["Kira", "Faturalar", "Ofis Malzemeleri", "Yemek", "Teknoloji", "Ulaşım", "Pazarlama", "Diğer"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result: Expense | null = null

      if (expense) {
        result = DatabaseOperations.expenses.update(expense.id, formData)
      } else {
        result = DatabaseOperations.expenses.create(formData)
      }

      if (result) {
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error saving expense:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{expense ? "Gider Düzenle" : "Yeni Gider Ekle"}</CardTitle>
        <CardDescription>
          {expense ? "Mevcut gider bilgilerini güncelleyin" : "Yeni gider bilgilerini girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Gider Açıklaması *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Gider açıklamasını girin"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Tutar (₺) *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="submittedBy">Gönderen *</Label>
            <Input
              id="submittedBy"
              value={formData.submittedBy}
              onChange={(e) => handleChange("submittedBy", e.target.value)}
              placeholder="Gönderen kişi"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="receipt"
              checked={formData.receipt}
              onCheckedChange={(checked) => handleChange("receipt", checked)}
            />
            <Label htmlFor="receipt">Makbuz mevcut</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Ek notlar (opsiyonel)"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : expense ? "Güncelle" : "Kaydet"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
