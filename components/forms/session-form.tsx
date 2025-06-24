"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PsychologyDatabase, type Session } from "@/lib/psychology-database"
import { useToast } from "@/hooks/use-toast"

interface SessionFormProps {
  session?: Session
  onSubmit: (session: Session) => void
  onCancel: () => void
}

export function SessionForm({ session, onSubmit, onCancel }: SessionFormProps) {
  const [formData, setFormData] = useState({
    patientId: session?.patientId || "",
    psychologistId: session?.psychologistId || "",
    date: session?.date || "",
    startTime: session?.startTime || "",
    endTime: session?.endTime || "",
    type: session?.type || "individual",
    duration: session?.duration || 50,
    notes: session?.notes || "",
    interventions: session?.interventions || [],
    homework: session?.homework || "",
    nextSessionPlan: session?.nextSessionPlan || "",
    mood: session?.mood || 5,
    progress: session?.progress || "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newIntervention, setNewIntervention] = useState("")
  const { toast } = useToast()

  const patients = PsychologyDatabase.patients.getAll()
  const psychologists = ["Dr. Zeynep Kaya", "Dr. Ahmet Özkan", "Dr. Merve Aslan", "Dr. Can Demir"]
  const commonInterventions = [
    "Bilişsel Yeniden Yapılandırma",
    "Nefes Egzersizleri",
    "Gevşeme Teknikleri",
    "Maruz Bırakma Terapisi",
    "Davranışsal Aktivasyon",
    "Mindfulness",
    "Problem Çözme Becerileri",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = "Hasta seçimi gerekli"
    }

    if (!formData.psychologistId) {
      newErrors.psychologistId = "Psikolog seçimi gerekli"
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
      let result: Session | null = null

      if (session) {
        result = PsychologyDatabase.sessions.update(session.id, formData)
      } else {
        result = PsychologyDatabase.sessions.create({
          ...formData,
          status: "scheduled",
        })
      }

      if (result) {
        toast({
          title: "Başarılı",
          description: session ? "Seans güncellendi" : "Yeni seans kaydedildi",
        })
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error saving session:", error)
      toast({
        title: "Hata",
        description: "Seans kaydedilirken bir hata oluştu",
        variant: "destructive",
      })
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

  const addIntervention = (intervention: string) => {
    if (intervention && !formData.interventions.includes(intervention)) {
      setFormData((prev) => ({
        ...prev,
        interventions: [...prev.interventions, intervention],
      }))
    }
    setNewIntervention("")
  }

  const removeIntervention = (intervention: string) => {
    setFormData((prev) => ({
      ...prev,
      interventions: prev.interventions.filter((i) => i !== intervention),
    }))
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : ""
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{session ? "Seans Düzenle" : "Yeni Seans Kaydı"}</CardTitle>
        <CardDescription>
          {session ? "Mevcut seans bilgilerini güncelleyin" : "Yeni seans bilgilerini girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Hasta *</Label>
                <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)}>
                  <SelectTrigger className={errors.patientId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Hasta seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && <p className="text-sm text-red-600">{errors.patientId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="psychologistId">Psikolog *</Label>
                <Select
                  value={formData.psychologistId}
                  onValueChange={(value) => handleChange("psychologistId", value)}
                >
                  <SelectTrigger className={errors.psychologistId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Psikolog seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {psychologists.map((psychologist) => (
                      <SelectItem key={psychologist} value={psychologist}>
                        {psychologist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.psychologistId && <p className="text-sm text-red-600">{errors.psychologistId}</p>}
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
                <Label htmlFor="type">Seans Türü *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seans türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Bireysel</SelectItem>
                    <SelectItem value="group">Grup</SelectItem>
                    <SelectItem value="family">Aile</SelectItem>
                    <SelectItem value="assessment">Değerlendirme</SelectItem>
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
                <Label htmlFor="duration">Süre (dakika)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", Number.parseInt(e.target.value) || 50)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Ruh Hali (1-10)</Label>
                <Input
                  id="mood"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) => handleChange("mood", Number.parseInt(e.target.value) || 5)}
                />
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seans Notları</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Seans Notları</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Seans sırasında yapılan gözlemler, hasta tepkileri, önemli konular..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">İlerleme Değerlendirmesi</Label>
                <Textarea
                  id="progress"
                  value={formData.progress}
                  onChange={(e) => handleChange("progress", e.target.value)}
                  placeholder="Hastanın genel ilerlemesi, hedeflere ulaşma durumu..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Interventions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Müdahaleler</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newIntervention}
                  onChange={(e) => setNewIntervention(e.target.value)}
                  placeholder="Yeni müdahale ekle"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addIntervention(newIntervention)
                    }
                  }}
                />
                <Button type="button" onClick={() => addIntervention(newIntervention)}>
                  Ekle
                </Button>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Yaygın müdahaleler:</p>
                <div className="flex flex-wrap gap-2">
                  {commonInterventions.map((intervention) => (
                    <Button
                      key={intervention}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addIntervention(intervention)}
                      disabled={formData.interventions.includes(intervention)}
                    >
                      {intervention}
                    </Button>
                  ))}
                </div>
              </div>

              {formData.interventions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Seçilen müdahaleler:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.interventions.map((intervention) => (
                      <Badge key={intervention} variant="default" className="cursor-pointer">
                        {intervention}
                        <button type="button" onClick={() => removeIntervention(intervention)} className="ml-2 text-xs">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Homework and Next Session */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ev Ödevi ve Sonraki Seans</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homework">Ev Ödevi</Label>
                <Textarea
                  id="homework"
                  value={formData.homework}
                  onChange={(e) => handleChange("homework", e.target.value)}
                  placeholder="Hastaya verilen ev ödevleri ve uygulamalar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextSessionPlan">Sonraki Seans Planı</Label>
                <Textarea
                  id="nextSessionPlan"
                  value={formData.nextSessionPlan}
                  onChange={(e) => handleChange("nextSessionPlan", e.target.value)}
                  placeholder="Sonraki seans için planlanan konular ve hedefler..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : session ? "Güncelle" : "Kaydet"}
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
