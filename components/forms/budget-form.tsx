import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BudgetFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

const initialState = {
  category: "",
  budgetAmount: "",
  spentAmount: "",
  period: "monthly",
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  status: "active",
  notes: "",
}

export default function BudgetForm({ onSubmit, onCancel }: BudgetFormProps) {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({
      ...form,
      budgetAmount: Number(form.budgetAmount),
      spentAmount: Number(form.spentAmount),
      year: Number(form.year),
      month: Number(form.month),
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Kategori</label>
          <Input name="category" value={form.category} onChange={handleChange} required placeholder="Kategori" />
        </div>
        <div>
          <label className="text-sm font-medium">Bütçe Tutarı (₺)</label>
          <Input name="budgetAmount" type="number" value={form.budgetAmount} onChange={handleChange} required placeholder="10000" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Harcanan (₺)</label>
          <Input name="spentAmount" type="number" value={form.spentAmount} onChange={handleChange} required placeholder="5000" />
        </div>
        <div>
          <label className="text-sm font-medium">Dönem</label>
          <select name="period" className="w-full p-2 border rounded-md" value={form.period} onChange={handleChange}>
            <option value="monthly">Aylık</option>
            <option value="quarterly">3 Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Yıl</label>
          <Input name="year" type="number" value={form.year} onChange={handleChange} required placeholder="2024" />
        </div>
        <div>
          <label className="text-sm font-medium">Ay</label>
          <Input name="month" type="number" value={form.month} onChange={handleChange} required placeholder="1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Durum</label>
          <select name="status" className="w-full p-2 border rounded-md" value={form.status} onChange={handleChange}>
            <option value="active">Aktif</option>
            <option value="exceeded">Aşıldı</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Notlar</label>
          <Input name="notes" value={form.notes} onChange={handleChange} placeholder="Ek notlar..." />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          İptal
        </Button>
        <Button type="submit" disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>
    </form>
  )
} 