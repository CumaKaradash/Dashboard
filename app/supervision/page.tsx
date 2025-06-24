"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Brain, Calendar, User, Clock, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"

interface Supervision {
  id: string
  superviseeId: string
  superviseeName: string
  supervisorId: string
  supervisorName: string
  date: string
  time: string
  duration: number
  type: "individual" | "group" | "case_review"
  status: "scheduled" | "completed" | "cancelled"
  topics: string[]
  notes?: string
  feedback?: string
  nextSessionPlan?: string
  createdAt: string
}

export default function SupervisionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [supervisions, setSupervisions] = useState<Supervision[]>([
    {
      id: "sup_001",
      superviseeId: "user_002",
      superviseeName: "Psikolog Ayşe Demir",
      supervisorId: "user_001",
      supervisorName: "Dr. Ahmet Özkan",
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      type: "individual",
      status: "completed",
      topics: ["Vaka Tartışması", "Terapi Teknikleri", "Etik Konular"],
      notes:
        "Hasta ile kurulan terapötik ilişki değerlendirildi. CBT tekniklerinin uygulanması konusunda geri bildirim verildi.",
      feedback: "Genel olarak başarılı bir süreç. Empati kurma becerileri geliştirilmeli.",
      nextSessionPlan: "Sonraki seansta aktif dinleme teknikleri üzerinde durulacak.",
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "sup_002",
      superviseeId: "user_002",
      superviseeName: "Psikolog Ayşe Demir",
      supervisorId: "user_001",
      supervisorName: "Dr. Ahmet Özkan",
      date: "2024-01-22",
      time: "14:00",
      duration: 60,
      type: "individual",
      status: "scheduled",
      topics: ["Aktif Dinleme", "Sınır Belirleme", "Karşı Aktarım"],
      createdAt: "2024-01-15T14:30:00Z",
    },
  ])
  const [selectedSupervision, setSelectedSupervision] = useState<Supervision | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  const handleViewSupervision = (supervision: Supervision) => {
    setSelectedSupervision(supervision)
    setShowDetails(true)
  }

  const handleEditSupervision = (supervision: Supervision) => {
    setSelectedSupervision(supervision)
    setShowForm(true)
  }

  const handleDeleteSupervision = (id: string) => {
    if (confirm("Bu süpervizyon kaydını silmek istediğinizden emin misiniz?")) {
      try {
        setSupervisions(supervisions.filter((s) => s.id !== id))
        toast({
          title: "Başarılı",
          description: "Süpervizyon kaydı silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Süpervizyon kaydı silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const handleCompleteSupervision = (id: string) => {
    setSupervisions(supervisions.map((s) => (s.id === id ? { ...s, status: "completed" as const } : s)))
    toast({
      title: "Başarılı",
      description: "Süpervizyon tamamlandı olarak işaretlendi",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Planlandı</Badge>
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "individual":
        return "Bireysel"
      case "group":
        return "Grup"
      case "case_review":
        return "Vaka İnceleme"
      default:
        return type
    }
  }

  const filteredSupervisions = supervisions.filter(
    (supervision) =>
      supervision.superviseeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervision.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervision.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const stats = {
    totalSupervisions: supervisions.length,
    completedSupervisions: supervisions.filter((s) => s.status === "completed").length,
    scheduledSupervisions: supervisions.filter((s) => s.status === "scheduled").length,
    thisMonthSupervisions: supervisions.filter((s) => {
      const supervisionDate = new Date(s.date)
      const thisMonth = new Date()
      return (
        supervisionDate.getMonth() === thisMonth.getMonth() && supervisionDate.getFullYear() === thisMonth.getFullYear()
      )
    }).length,
  }

  if (!hasPermission("supervision_records") && !hasPermission("supervision_management")) {
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
            <h1 className="text-2xl font-bold text-gray-900">Süpervizyon Yönetimi</h1>
            <p className="text-gray-600">Süpervizyon seansları ve kayıtları</p>
          </div>
          <div className="flex items-center gap-3">
            {hasPermission("supervision_management") && (
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Süpervizyon
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
                  <p className="text-sm font-medium text-gray-600">Toplam Süpervizyon</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSupervisions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedSupervisions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Planlanmış</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduledSupervisions}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthSupervisions}</p>
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
                placeholder="Süpervizör, süpervizyon alan veya konu ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Supervisions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSupervisions.map((supervision) => (
            <Card key={supervision.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supervision.superviseeName}</CardTitle>
                    <CardDescription>Süpervizör: {supervision.supervisorName}</CardDescription>
                  </div>
                  {getStatusBadge(supervision.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{supervision.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {supervision.time} ({supervision.duration} dakika)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Brain className="w-4 h-4" />
                    <span>{getTypeLabel(supervision.type)}</span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Konular:</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervision.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {supervision.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notlar:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{supervision.notes}</p>
                    </div>
                  )}

                  {supervision.feedback && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-700 mb-1">Geri Bildirim:</p>
                      <p className="text-sm text-blue-600 line-clamp-2">{supervision.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewSupervision(supervision)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Görüntüle
                  </Button>
                  <div className="flex items-center gap-2">
                    {supervision.status === "scheduled" && (
                      <Button variant="default" size="sm" onClick={() => handleCompleteSupervision(supervision.id)}>
                        Tamamla
                      </Button>
                    )}
                    {hasPermission("supervision_management") && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEditSupervision(supervision)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteSupervision(supervision.id)}>
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

        {filteredSupervisions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Süpervizyon Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Arama kriterlerinize uygun süpervizyon bulunamadı." : "Henüz süpervizyon kaydı yok."}
              </p>
              {hasPermission("supervision_management") && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Süpervizyonu Ekle
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Supervision Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSupervision && `Süpervizyon Detayları - ${selectedSupervision.superviseeName}`}
            </DialogTitle>
          </DialogHeader>
          {selectedSupervision && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Süpervizyon Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Süpervizyon Alan:</strong> {selectedSupervision.superviseeName}
                    </p>
                    <p>
                      <strong>Süpervizör:</strong> {selectedSupervision.supervisorName}
                    </p>
                    <p>
                      <strong>Tarih:</strong> {selectedSupervision.date}
                    </p>
                    <p>
                      <strong>Saat:</strong> {selectedSupervision.time}
                    </p>
                    <p>
                      <strong>Süre:</strong> {selectedSupervision.duration} dakika
                    </p>
                    <p>
                      <strong>Tür:</strong> {getTypeLabel(selectedSupervision.type)}
                    </p>
                    <p>
                      <strong>Durum:</strong> {getStatusBadge(selectedSupervision.status)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Konular</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupervision.topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSupervision.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Süpervizyon Notları</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedSupervision.notes}</p>
                  </div>
                </div>
              )}

              {selectedSupervision.feedback && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Geri Bildirim</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedSupervision.feedback}</p>
                  </div>
                </div>
              )}

              {selectedSupervision.nextSessionPlan && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Sonraki Seans Planı</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedSupervision.nextSessionPlan}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Supervision Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSupervision ? "Süpervizyon Düzenle" : "Yeni Süpervizyon Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Süpervizyon Alan</label>
                <select className="w-full p-2 border rounded-md" defaultValue={selectedSupervision?.superviseeId}>
                  <option value="">Seçin</option>
                  <option value="user_002">Psikolog Ayşe Demir</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Süpervizör</label>
                <select className="w-full p-2 border rounded-md" defaultValue={selectedSupervision?.supervisorId}>
                  <option value="">Seçin</option>
                  <option value="user_001">Dr. Ahmet Özkan</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Tarih</label>
                <Input type="date" defaultValue={selectedSupervision?.date} />
              </div>
              <div>
                <label className="text-sm font-medium">Saat</label>
                <Input type="time" defaultValue={selectedSupervision?.time} />
              </div>
              <div>
                <label className="text-sm font-medium">Süre (dakika)</label>
                <Input type="number" placeholder="60" defaultValue={selectedSupervision?.duration} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tür</label>
              <select className="w-full p-2 border rounded-md" defaultValue={selectedSupervision?.type}>
                <option value="individual">Bireysel</option>
                <option value="group">Grup</option>
                <option value="case_review">Vaka İnceleme</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Konular</label>
              <Input
                placeholder="Konuları virgülle ayırın (örn: Vaka Tartışması, Terapi Teknikleri)"
                defaultValue={selectedSupervision?.topics.join(", ")}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notlar</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Süpervizyon notları..."
                defaultValue={selectedSupervision?.notes}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Geri Bildirim</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Süpervizyon alan için geri bildirim..."
                defaultValue={selectedSupervision?.feedback}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sonraki Seans Planı</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={2}
                placeholder="Sonraki süpervizyon için plan..."
                defaultValue={selectedSupervision?.nextSessionPlan}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowForm(false)}>{selectedSupervision ? "Güncelle" : "Kaydet"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
