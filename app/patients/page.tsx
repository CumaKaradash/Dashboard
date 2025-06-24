"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, User, Phone, Calendar, FileText, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type Patient } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { user, hasPermission } = usePsychologyAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/patients")
      const data = await res.json()
      setPatients(data)
    } catch {
      // hata yönetimi
    } finally {
      setLoading(false)
    }
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  const handleEditPatient = (patient: Patient) => {
    alert(`Hasta düzenleme özelliği geliştiriliyor...\n\nHasta: ${patient.firstName} ${patient.lastName}`)
  }

  const handleDeletePatient = async (id: string) => {
    if (confirm("Bu hasta kaydını silmek istediğinizden emin misiniz?")) {
      try {
        const res = await fetch(`/api/patients/${id}`, { method: "DELETE" })
        if (res.ok) {
          loadPatients()
        } else {
          // hata yönetimi
        }
      } catch {
        // hata yönetimi
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "inactive":
        return <Badge className="bg-yellow-100 text-yellow-800">Pasif</Badge>
      case "discharged":
        return <Badge className="bg-gray-100 text-gray-800">Taburcu</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.primaryPsychologist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter((p) => p.status === "active").length,
    newThisMonth: patients.filter((p) => {
      const regDate = new Date(p.registrationDate)
      const thisMonth = new Date()
      return regDate.getMonth() === thisMonth.getMonth() && regDate.getFullYear() === thisMonth.getFullYear()
    }).length,
  }

  if (!hasPermission("patient_management") && !hasPermission("patient_files_basic")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Erişim Yetkisi Yok</h2>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hasta Yönetimi</h1>
            <p className="text-gray-600">Hasta kayıtları ve bilgi yönetimi</p>
          </div>
          <div className="flex items-center gap-3">
            {hasPermission("patient_management") && (
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Hasta
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Hasta</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Hasta</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bu Ay Yeni</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Hasta adı, telefon veya psikolog ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {patient.firstName} {patient.lastName}
                    </CardTitle>
                    <CardDescription>
                      {calculateAge(patient.dateOfBirth)} yaş •{" "}
                      {patient.gender === "male" ? "Erkek" : patient.gender === "female" ? "Kadın" : "Diğer"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{patient.primaryPsychologist}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Kayıt: {patient.registrationDate}</span>
                  </div>
                  {patient.notes && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span className="line-clamp-2">{patient.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Görüntüle
                  </Button>
                  <div className="flex items-center gap-2">
                    {hasPermission("patient_management") && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPatient && `${selectedPatient.firstName} ${selectedPatient.lastName} - Hasta Detayları`}
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Kişisel Bilgiler</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Yaş:</strong> {calculateAge(selectedPatient.dateOfBirth)}
                    </p>
                    <p>
                      <strong>Cinsiyet:</strong>{" "}
                      {selectedPatient.gender === "male"
                        ? "Erkek"
                        : selectedPatient.gender === "female"
                          ? "Kadın"
                          : "Diğer"}
                    </p>
                    <p>
                      <strong>Telefon:</strong> {selectedPatient.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedPatient.email || "Belirtilmemiş"}
                    </p>
                    <p>
                      <strong>Adres:</strong> {selectedPatient.address || "Belirtilmemiş"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Tedavi Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Psikolog:</strong> {selectedPatient.primaryPsychologist}
                    </p>
                    <p>
                      <strong>Durum:</strong>{" "}
                      {selectedPatient.status === "active"
                        ? "Aktif"
                        : selectedPatient.status === "inactive"
                          ? "Pasif"
                          : "Taburcu"}
                    </p>
                    <p>
                      <strong>Kayıt Tarihi:</strong> {selectedPatient.registrationDate}
                    </p>
                    <p>
                      <strong>Sevk Kaynağı:</strong> {selectedPatient.referralSource || "Belirtilmemiş"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Data Tabs */}
              <Tabs defaultValue="sessions" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="sessions">Seanslar</TabsTrigger>
                  <TabsTrigger value="assessments">Değerlendirmeler</TabsTrigger>
                  <TabsTrigger value="therapy-plans">Terapi Planları</TabsTrigger>
                  <TabsTrigger value="documents">Belgeler</TabsTrigger>
                </TabsList>

                <TabsContent value="sessions" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Son Seanslar</h4>
                    {PsychologyDatabase.sessions
                      .getByPatient(selectedPatient.id)
                      .slice(0, 5)
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                          <div>
                            <p className="font-medium">
                              {session.date} - {session.startTime}
                            </p>
                            <p className="text-sm text-gray-600">
                              {session.type === "individual" ? "Bireysel" : session.type === "group" ? "Grup" : "Aile"}{" "}
                              Seans
                            </p>
                            {session.notes && (
                              <p className="text-sm text-gray-500 mt-1">{session.notes.substring(0, 100)}...</p>
                            )}
                          </div>
                          <Badge
                            variant={
                              session.status === "completed"
                                ? "default"
                                : session.status === "scheduled"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {session.status === "completed"
                              ? "Tamamlandı"
                              : session.status === "scheduled"
                                ? "Planlandı"
                                : "İptal"}
                          </Badge>
                        </div>
                      ))}
                    {PsychologyDatabase.sessions.getByPatient(selectedPatient.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Henüz seans kaydı bulunmuyor</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Psikolojik Değerlendirmeler</h4>
                    {PsychologyDatabase.assessments.getByPatient(selectedPatient.id).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{assessment.type}</p>
                          <p className="text-sm text-gray-600">{assessment.date}</p>
                          <p className="text-sm text-gray-500">{assessment.interpretation}</p>
                        </div>
                        <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                          {assessment.status === "completed" ? "Tamamlandı" : "Taslak"}
                        </Badge>
                      </div>
                    ))}
                    {PsychologyDatabase.assessments.getByPatient(selectedPatient.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Henüz değerlendirme kaydı bulunmuyor</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="therapy-plans" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Terapi Planları</h4>
                    {PsychologyDatabase.therapyPlans.getByPatient(selectedPatient.id).map((plan) => (
                      <div key={plan.id} className="py-2 border-b last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Plan #{plan.id}</p>
                          <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                            {plan.status === "active" ? "Aktif" : "Tamamlandı"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Süre: {plan.timeline}</p>
                        <div className="text-sm">
                          <p className="font-medium">Hedefler:</p>
                          <ul className="list-disc list-inside text-gray-600 ml-2">
                            {plan.goals.slice(0, 3).map((goal, index) => (
                              <li key={index}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        {plan.progress && <p className="text-sm text-green-600 mt-2">İlerleme: {plan.progress}</p>}
                      </div>
                    ))}
                    {PsychologyDatabase.therapyPlans.getByPatient(selectedPatient.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Henüz terapi planı bulunmuyor</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Hasta Belgeleri</h4>
                    {PsychologyDatabase.documents.getByPatient(selectedPatient.id).map((document) => (
                      <div
                        key={document.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{document.title}</p>
                          <p className="text-sm text-gray-600">
                            {document.uploadDate} - {document.uploadedBy}
                          </p>
                          {document.description && <p className="text-sm text-gray-500">{document.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {document.type === "consent"
                              ? "Onam"
                              : document.type === "assessment"
                                ? "Değerlendirme"
                                : document.type === "report"
                                  ? "Rapor"
                                  : "Diğer"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {PsychologyDatabase.documents.getByPatient(selectedPatient.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Henüz belge bulunmuyor</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Emergency Contact and Medical Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Acil Durum İletişim</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p>
                      <strong>Ad:</strong> {selectedPatient.emergencyContact.name}
                    </p>
                    <p>
                      <strong>Telefon:</strong> {selectedPatient.emergencyContact.phone}
                    </p>
                    <p>
                      <strong>Yakınlık:</strong> {selectedPatient.emergencyContact.relationship}
                    </p>
                  </div>
                </div>

                {(selectedPatient.medicalHistory || selectedPatient.currentMedications) && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tıbbi Bilgiler</h3>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                      {selectedPatient.medicalHistory && (
                        <div>
                          <p className="font-medium">Tıbbi Geçmiş:</p>
                          <p className="text-gray-600">{selectedPatient.medicalHistory}</p>
                        </div>
                      )}
                      {selectedPatient.currentMedications && (
                        <div>
                          <p className="font-medium">Mevcut İlaçlar:</p>
                          <p className="text-gray-600">{selectedPatient.currentMedications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedPatient.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Notlar</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedPatient.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
