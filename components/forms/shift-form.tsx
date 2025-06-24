"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseOperations, type Shift } from "@/lib/database"

interface ShiftFormProps {
  shift?: Shift
  onSubmit: (shift: Shift) => void
  onCancel: () => void
}

export function ShiftForm({ shift, onSubmit, onCancel }: ShiftFormProps) {
  const [formData, setFormData] = useState({
    employeeName: shift?.employeeName || "",
    employeeId: shift?.employeeId || "",
    date: shift?.date || "",
    startTime: shift?.startTime || "",
    endTime: shift?.endTime || "",
    position: shift?.position || "",
    breakTime: shift?.breakTime || 30,
    notes: shift?.notes || "",
  })

  const [loading, setLoading] = useState(false)

  const positions = ["Satış Danışmanı", "Kasiyer", "Muhasebe", "İnsan Kaynakları", "Yönetici", "Temizlik", "Güvenlik"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result: Shift | null = null

      if (shift) {
        result = DatabaseOperations.shifts.update(shift.id, formData)
      } else {
        result = DatabaseOperations.shifts.create(formData)
      }

      if (result) {
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error saving shift:", error)
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
        <CardTitle>{shift ? "Vardiya Düzenle" : "Yeni Vardiya Oluştur"}</CardTitle>
        <CardDescription>
          {shift ? "Mevcut vardiya bilgilerini güncelleyin" : "Yeni vardiya bilgilerini girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Personel Adı *</Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => handleChange("employeeName", e.target.value)}
                placeholder="Personel adını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Personel ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                placeholder="Personel ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tarih *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Pozisyon *</Label>
              <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pozisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Başlangıç Saati *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Bitiş Saati *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakTime">Mola Süresi (dakika)</Label>
              <Input
                id="breakTime"
                type="number"
                min="0"
                value={formData.breakTime}
                onChange={(e) => handleChange("breakTime", Number.parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Özel notlar (opsiyonel)"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : shift ? "Güncelle" : "Kaydet"}
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
