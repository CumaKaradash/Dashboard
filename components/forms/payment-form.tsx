import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PaymentFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

const initialState = {
  patientName: "",
  amount: "",
  method: "cash",
  status: "completed",
  date: new Date().toISOString().split("T")[0],
  time: "",
  description: "",
  notes: "",
}

export default function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
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
      amount: Number(form.amount),
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Hasta</label>
          <Input name="patientName" value={form.patientName} onChange={handleChange} required placeholder="Hasta adı" />
        </div>
        <div>
          <label className="text-sm font-medium">Tutar (₺)</label>
          <Input name="amount" type="number" value={form.amount} onChange={handleChange} required placeholder="350" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Ödeme Yöntemi</label>
          <select name="method" className="w-full p-2 border rounded-md" value={form.method} onChange={handleChange}>
            <option value="cash">Nakit</option>
            <option value="card">Kart</option>
            <option value="transfer">Havale</option>
            <option value="insurance">Sigorta</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Durum</label>
          <select name="status" className="w-full p-2 border rounded-md" value={form.status} onChange={handleChange}>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekliyor</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Açıklama</label>
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Ödeme açıklaması" />
      </div>
      <div>
        <label className="text-sm font-medium">Notlar</label>
        <textarea name="notes" className="w-full p-2 border rounded-md" rows={3} value={form.notes} onChange={handleChange} placeholder="Ek notlar..." />
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