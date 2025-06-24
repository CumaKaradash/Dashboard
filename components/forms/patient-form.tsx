"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PsychologyDatabase, type Patient } from "@/lib/psychology-database"
import { useToast } from "@/hooks/use-toast"

interface PatientFormProps {
  patient?: Patient
  onSubmit: (patient: Patient) => void
  onCancel: () => void
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "female",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    emergencyContactName: patient?.emergencyContact?.name || "",
    emergencyContactPhone: patient?.emergencyContact?.phone || "",
    emergencyContactRelationship: patient?.emergencyContact?.relationship || "",
    referralSource: patient?.referralSource || "",
    primaryPsychologist: patient?.primaryPsychologist || "",
    notes: patient?.notes || "",
    medicalHistory: patient?.medicalHistory || "",
    currentMedications: patient?.currentMedications || "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const psychologists = ["Dr. Zeynep Kaya", "Dr. Ahmet Özkan", "Dr. Merve Aslan", "Dr. Can Demir"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ad gerekli"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyad gerekli"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Doğum tarihi gerekli"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon gerekli"
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Acil durum iletişim adı gerekli"
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Acil durum telefonu gerekli"
    }

    if (!formData.primaryPsychologist) {
      newErrors.primaryPsychologist = "Psikolog seçimi gerekli"
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
      const patientData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female" | "other",
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        },
        referralSource: formData.referralSource,
        primaryPsychologist: formData.primaryPsychologist,
        status: "active" as const,
        notes: formData.notes,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
      }

      let result: Patient | null = null

      if (patient) {
        result = PsychologyDatabase.patients.update(patient.id, patientData)
      } else {
        result = PsychologyDatabase.patients.create(patientData)
      }

      if (result) {
        toast({
          title: "Başarılı",
          description: patient ? "Hasta bilgileri güncellendi" : "Yeni hasta kaydedildi",
        })
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error saving patient:", error)
      toast({
        title: "Hata",
        description: "Hasta kaydedilirken bir hata oluştu",
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{patient ? "Hasta Bilgilerini Düzenle" : "Yeni Hasta Kaydı"}</CardTitle>
        <CardDescription>
          {patient ? "Mevcut hasta bilgilerini güncelleyin" : "Yeni hasta bilgilerini girin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Ad"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Soyad"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Doğum Tarihi *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Cinsiyet *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Kadın</SelectItem>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Tam adres"
                rows={2}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acil Durum İletişim</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Ad Soyad *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                  placeholder="Acil durum iletişim kişisi"
                  className={errors.emergencyContactName ? "border-red-500" : ""}
                />
                {errors.emergencyContactName && <p className="text-sm text-red-600">{errors.emergencyContactName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Telefon *</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className={errors.emergencyContactPhone ? "border-red-500" : ""}
                />
                {errors.emergencyContactPhone && <p className="text-sm text-red-600">{errors.emergencyContactPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Yakınlık</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleChange("emergencyContactRelationship", e.target.value)}
                  placeholder="Anne, Baba, Eş, vb."
                />
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tedavi Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryPsychologist">Psikolog *</Label>
                <Select
                  value={formData.primaryPsychologist}
                  onValueChange={(value) => handleChange("primaryPsychologist", value)}
                >
                  <SelectTrigger className={errors.primaryPsychologist ? "border-red-500" : ""}>
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
                {errors.primaryPsychologist && <p className="text-sm text-red-600">{errors.primaryPsychologist}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">Sevk Kaynağı</Label>
                <Input
                  id="referralSource"
                  value={formData.referralSource}
                  onChange={(e) => handleChange("referralSource", e.target.value)}
                  placeholder="Aile hekimi, başka psikolog, vb."
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tıbbi Bilgiler</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Tıbbi Geçmiş</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange("medicalHistory", e.target.value)}
                  placeholder="Geçmiş hastalıklar, ameliyatlar, vb."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Mevcut İlaçlar</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleChange("currentMedications", e.target.value)}
                  placeholder="Kullanılan ilaçlar ve dozları"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Özel notlar ve gözlemler"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : patient ? "Güncelle" : "Kaydet"}
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
