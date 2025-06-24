"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseOperations, type Appointment } from "@/lib/database"

interface AppointmentFormProps {
  appointment?: Appointment
  onSubmit: (appointment: Appointment) => void
  onCancel: () => void
}

export function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientName: appointment?.clientName || "",
    clientPhone: appointment?.clientPhone || "",
    clientEmail: appointment?.clientEmail || "",
    service: appointment?.service || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    duration: appointment?.duration || 30,
    staff: appointment?.staff || "",
    price: appointment?.price || 0,
    notes: appointment?.notes || "",
  })

  const [loading, setLoading] = useState(false)

  const services = ["Saç Kesimi", "Makyaj", "Masaj", "Cilt Bakımı", "Manikür", "Pedikür", "Diğer"]
  const staff = ["Mehmet Barber", "Zeynep Güzellik", "Ali Masöz", "Fatma Estetisyen", "Can Kuaför"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result: Appointment | null = null

      if (appointment) {
        result = DatabaseOperations.appointments.update(appointment.id, formData)
      } else {
        result = DatabaseOperations.appointments.create(formData)
      }

      if (result) {
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error saving appointment:", error)
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
        <CardTitle>{appointment ? "Randevu Düzenle" : "Yeni Randevu Oluştur"}</CardTitle>
        <CardDescription>
          {appointment ? "Mevcut randevu bilgilerini güncelleyin" : "Yeni randevu bilgilerini girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Müşteri Adı *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="Müşteri adını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Telefon *</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleChange("clientPhone", e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleChange("clientEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Hizmet *</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Hizmet seçin" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="time">Saat *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Süre (dakika) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => handleChange("duration", Number.parseInt(e.target.value) || 30)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff">Personel *</Label>
              <Select value={formData.staff} onValueChange={(value) => handleChange("staff", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Personel seçin" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Ücret (₺)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
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
              {loading ? "Kaydediliyor..." : appointment ? "Güncelle" : "Kaydet"}
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
