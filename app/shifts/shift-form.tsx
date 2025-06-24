"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatabaseOperations, type Shift } from "@/lib/database"

interface ShiftFormProps {
  shift?: Shift
  onCancel: () => void
  onShiftUpdated: () => void
}

export default function ShiftForm({ shift, onCancel, onShiftUpdated }: ShiftFormProps) {
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const positions = ["Satış Danışmanı", "Kasiyer", "Muhasebe", "İnsan Kaynakları", "Yönetici", "Temizlik", "Güvenlik"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Personel adı gerekli"
    }

    if (!formData.date) {
      newErrors.date = "Tarih gerekli"
    }

    if (!formData.startTime) {
      newErrors.startTime = "Başlangıç saati gerekli"
    }

    if (!formData.endTime) {
      newErrors.endTime = "Bitiş saati gerekli"
    }

    if (!formData.position) {
      newErrors.position = "Pozisyon gerekli"
    }

    // Check if end time is after start time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01 ${formData.startTime}`)
      const end = new Date(`2000-01-01 ${formData.endTime}`)

      if (end <= start) {
        newErrors.endTime = "Bitiş saati başlangıç saatinden sonra olmalı"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      let result: Shift | null = null

      if (shift) {
        result = DatabaseOperations.shifts.update(shift.id, formData)
      } else {
        result = DatabaseOperations.shifts.create(formData)
      }

      if (result) {
        onShiftUpdated()
        onCancel()
      }
    } catch (error) {
      console.error("Error saving shift:", error)
      setErrors({ general: "Vardiya kaydedilirken bir hata oluştu" })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeName">Personel Adı *</Label>
          <Input
            id="employeeName"
            value={formData.employeeName}
            onChange={(e) => handleChange("employeeName", e.target.value)}
            placeholder="Personel adını girin"
            className={errors.employeeName ? "border-red-500" : ""}
          />
          {errors.employeeName && <p className="text-sm text-red-600">{errors.employeeName}</p>}
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
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Pozisyon *</Label>
          <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
            <SelectTrigger className={errors.position ? "border-red-500" : ""}>
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
          {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Başlangıç Saati *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
            className={errors.startTime ? "border-red-500" : ""}
          />
          {errors.startTime && <p className="text-sm text-red-600">{errors.startTime}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Bitiş Saati *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
            className={errors.endTime ? "border-red-500" : ""}
          />
          {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="breakTime">Mola Süresi (dakika)</Label>
          <Input
            id="breakTime"
            type="number"
            min="0"
            max="480"
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
  )
}
