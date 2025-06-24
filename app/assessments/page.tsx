"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Brain, FileText, Calendar, User, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type Assessment, type Patient } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const allAssessments = PsychologyDatabase.assessments.getAll()
      const allPatients = PsychologyDatabase.patients.getAll()
      setAssessments(allAssessments)
      setPatients(allPatients)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Veriler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : "Bilinmeyen Hasta"
  }

  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setShowDetails(true)
  }

  const handleEditAssessment = (assessment: Assessment) => {
    toast({
      title: "Geliştiriliyor",
      description: "Değerlendirme düzenleme özelliği yakında eklenecek",
    })
  }

  const handleDeleteAssessment = (id: string) => {
    if (confirm("Bu değerlendirmeyi silmek istediğinizden emin misiniz?")) {
      try {
        PsychologyDatabase.assessments.delete?.(id)
        loadData()
        toast({
          title: "Başarılı",
          description: "Değerlendirme silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Değerlendirme silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Taslak</Badge>
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-800">İncelendi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const patientName = getPatientName(assessment.patientId).toLowerCase()
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.psychologistId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const stats = {
    totalAssessments: assessments.length,
    completedAssessments: assessments.filter((a) => a.status === "completed").length,
    draftAssessments: assessments.filter((a) => a.status === "draft").length,
    thisMonthAssessments: assessments.filter((a) => {
      const assessmentDate = new Date(a.date)
      const thisMonth = new Date()
      return (
        assessmentDate.getMonth() === thisMonth.getMonth() && assessmentDate.getFullYear() === thisMonth.getFullYear()
      )
    }).length,
  }

  if (!hasPermission("psychological_assessments") && !hasPermission("basic_assessments")) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Değerlendirmeler yükleniyor...</p>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Psikolojik Değerlendirmeler</h1>
            <p className="text-gray-600">Test sonuçları ve değerlendirme raporları</p>
          </div>
          <div className="flex items-center gap-3">
            {hasPermission("psychological_assessments") && (
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Değerlendirme
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Değerlendirme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taslak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.draftAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthAssessments}</p>
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
                placeholder="Hasta adı, test türü veya psikolog ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assessments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{assessment.type}</CardTitle>
                    <CardDescription>{getPatientName(assessment.patientId)}</CardDescription>
                  </div>
                  {getStatusBadge(assessment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{assessment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{assessment.psychologistId}</span>
                  </div>
                  {assessment.results && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Sonuçlar:</p>
                      {Object.entries(assessment.results).map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-600">
                          {key}: {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{assessment.interpretation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewAssessment(assessment)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Görüntüle
                  </Button>
                  <div className="flex items-center gap-2">
                    {hasPermission("psychological_assessments") && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEditAssessment(assessment)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteAssessment(assessment.id)}>
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

        {filteredAssessments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Değerlendirme Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Arama kriterlerinize uygun değerlendirme bulunamadı."
                  : "Henüz değerlendirme eklenmemiş."}
              </p>
              {hasPermission("psychological_assessments") && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Değerlendirmeyi Ekle
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assessment Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssessment && `${selectedAssessment.type} - ${getPatientName(selectedAssessment.patientId)}`}
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Değerlendirme Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Test Türü:</strong> {selectedAssessment.type}
                    </p>
                    <p>
                      <strong>Hasta:</strong> {getPatientName(selectedAssessment.patientId)}
                    </p>
                    <p>
                      <strong>Psikolog:</strong> {selectedAssessment.psychologistId}
                    </p>
                    <p>
                      <strong>Tarih:</strong> {selectedAssessment.date}
                    </p>
                    <p>
                      <strong>Durum:</strong> {getStatusBadge(selectedAssessment.status)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Test Sonuçları</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {Object.entries(selectedAssessment.results).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-sm font-medium">{key}:</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Yorumlama</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedAssessment.interpretation}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Öneriler</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {selectedAssessment.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Assessment Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Değerlendirme Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Hasta</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Hasta seçin</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Test Türü</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Test türü seçin</option>
                  <option value="Beck Anksiyete Envanteri">Beck Anksiyete Envanteri</option>
                  <option value="Beck Depresyon Envanteri">Beck Depresyon Envanteri</option>
                  <option value="MMPI-2">MMPI-2</option>
                  <option value="Rorschach Testi">Rorschach Testi</option>
                  <option value="WAIS-IV">WAIS-IV</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Test Sonuçları</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Test sonuçlarını girin..." />
            </div>
            <div>
              <label className="text-sm font-medium">Yorumlama</label>
              <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Test yorumlaması..." />
            </div>
            <div>
              <label className="text-sm font-medium">Öneriler</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Öneriler (her satıra bir öneri)..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowForm(false)}>Kaydet</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
