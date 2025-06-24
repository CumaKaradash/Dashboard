"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, FileText, Upload, Download, Eye, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type Document, type Patient } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const allDocuments = PsychologyDatabase.documents.getAll()
      const allPatients = PsychologyDatabase.patients.getAll()
      setDocuments(allDocuments)
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

  const getPatientName = (patientId?: string) => {
    if (!patientId) return "Genel Doküman"
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : "Bilinmeyen Hasta"
  }

  const handleViewDocument = (document: Document) => {
    toast({
      title: "Doküman Görüntüleme",
      description: `${document.title} dosyası açılıyor...`,
    })
  }

  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "İndiriliyor",
      description: `${document.title} dosyası indiriliyor...`,
    })
  }

  const handleDeleteDocument = (id: string) => {
    if (confirm("Bu dokümanı silmek istediğinizden emin misiniz?")) {
      try {
        PsychologyDatabase.documents.delete(id)
        loadData()
        toast({
          title: "Başarılı",
          description: "Doküman silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Doküman silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "consent":
        return "Onam Formu"
      case "assessment":
        return "Değerlendirme"
      case "report":
        return "Rapor"
      case "correspondence":
        return "Yazışma"
      case "other":
        return "Diğer"
      default:
        return type
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      consent: "bg-green-100 text-green-800",
      assessment: "bg-blue-100 text-blue-800",
      report: "bg-purple-100 text-purple-800",
      correspondence: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    }
    return <Badge className={colors[type as keyof typeof colors] || colors.other}>{getTypeLabel(type)}</Badge>
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(doc.patientId).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || doc.type === selectedType
    return matchesSearch && matchesType
  })

  const stats = {
    totalDocuments: documents.length,
    consentForms: documents.filter((d) => d.type === "consent").length,
    assessments: documents.filter((d) => d.type === "assessment").length,
    reports: documents.filter((d) => d.type === "report").length,
  }

  if (!hasPermission("document_management")) {
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
          <p className="mt-2 text-gray-600">Dokümanlar yükleniyor...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Doküman Yönetimi</h1>
            <p className="text-gray-600">Hasta dosyaları ve belgeler</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Doküman Yükle
            </Button>
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
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Doküman</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
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
                  <p className="text-sm font-medium text-gray-600">Onam Formu</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.consentForms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Değerlendirme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.assessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rapor</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Doküman adı, hasta veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md w-48"
              >
                <option value="all">Tüm Türler</option>
                <option value="consent">Onam Formu</option>
                <option value="assessment">Değerlendirme</option>
                <option value="report">Rapor</option>
                <option value="correspondence">Yazışma</option>
                <option value="other">Diğer</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Doküman Listesi</CardTitle>
            <CardDescription>Tüm hasta dosyaları ve belgeler</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Doküman Adı</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tür</th>
                    <th className="text-left p-4 font-medium text-gray-900">Hasta</th>
                    <th className="text-left p-4 font-medium text-gray-900">Yükleyen</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tarih</th>
                    <th className="text-left p-4 font-medium text-gray-900">Etiketler</th>
                    <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{document.title}</div>
                            {document.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">{document.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getTypeBadge(document.type)}</td>
                      <td className="p-4 text-gray-600">{getPatientName(document.patientId)}</td>
                      <td className="p-4 text-gray-600">{document.uploadedBy}</td>
                      <td className="p-4 text-gray-600">{document.uploadDate}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {document.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{document.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDocument(document)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(document)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(document.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredDocuments.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Doküman Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Arama kriterlerinize uygun doküman bulunamadı." : "Henüz doküman yüklenmemiş."}
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                İlk Dokümanı Yükle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doküman Yükle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Doküman Adı</label>
                <Input placeholder="Doküman başlığı" />
              </div>
              <div>
                <label className="text-sm font-medium">Tür</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tür seçin</option>
                  <option value="consent">Onam Formu</option>
                  <option value="assessment">Değerlendirme</option>
                  <option value="report">Rapor</option>
                  <option value="correspondence">Yazışma</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Hasta (Opsiyonel)</label>
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
              <label className="text-sm font-medium">Açıklama</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Doküman açıklaması..." />
            </div>
            <div>
              <label className="text-sm font-medium">Etiketler</label>
              <Input placeholder="Etiketleri virgülle ayırın (örn: onam, yasal, önemli)" />
            </div>
            <div>
              <label className="text-sm font-medium">Dosya</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Dosyayı buraya sürükleyin veya seçin</p>
                <Button variant="outline" size="sm">
                  Dosya Seç
                </Button>
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (Max: 10MB)</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowUpload(false)}>Yükle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
