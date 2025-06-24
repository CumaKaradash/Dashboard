"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Target, Calendar, User, Edit, Trash2, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type TherapyPlan, type Patient } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"

export default function TherapyPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [therapyPlans, setTherapyPlans] = useState<TherapyPlan[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPlan, setSelectedPlan] = useState<TherapyPlan | null>(null)
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
      const allPlans = PsychologyDatabase.therapyPlans.getAll()
      const allPatients = PsychologyDatabase.patients.getAll()
      setTherapyPlans(allPlans)
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

  const handleViewPlan = (plan: TherapyPlan) => {
    setSelectedPlan(plan)
    setShowDetails(true)
  }

  const handleEditPlan = (plan: TherapyPlan) => {
    toast({
      title: "Geliştiriliyor",
      description: "Terapi planı düzenleme özelliği yakında eklenecek",
    })
  }

  const handleDeletePlan = (id: string) => {
    if (confirm("Bu terapi planını silmek istediğinizden emin misiniz?")) {
      try {
        PsychologyDatabase.therapyPlans.delete?.(id)
        loadData()
        toast({
          title: "Başarılı",
          description: "Terapi planı silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Terapi planı silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const handleCompletePlan = (id: string) => {
    try {
      PsychologyDatabase.therapyPlans.update(id, { status: "completed" })
      loadData()
      toast({
        title: "Başarılı",
        description: "Terapi planı tamamlandı olarak işaretlendi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Plan güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Tamamlandı</Badge>
      case "modified":
        return <Badge className="bg-yellow-100 text-yellow-800">Değiştirildi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredPlans = therapyPlans.filter((plan) => {
    const patientName = getPatientName(plan.patientId).toLowerCase()
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      plan.psychologistId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.goals.some((goal) => goal.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const stats = {
    totalPlans: therapyPlans.length,
    activePlans: therapyPlans.filter((p) => p.status === "active").length,
    completedPlans: therapyPlans.filter((p) => p.status === "completed").length,
    thisMonthPlans: therapyPlans.filter((p) => {
      const planDate = new Date(p.createdDate)
      const thisMonth = new Date()
      return planDate.getMonth() === thisMonth.getMonth() && planDate.getFullYear() === thisMonth.getFullYear()
    }).length,
  }

  if (!hasPermission("therapy_plans")) {
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
          <p className="mt-2 text-gray-600">Terapi planları yükleniyor...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Terapi Planları</h1>
            <p className="text-gray-600">Tedavi planları ve hedefler</p>
          </div>
          <div className="flex items-center gap-3">
            {hasPermission("therapy_plans") && (
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Plan
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
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Plan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Plan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activePlans}</p>
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
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedPlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthPlans}</p>
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
                placeholder="Hasta adı, psikolog veya hedef ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Therapy Plans List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{getPatientName(plan.patientId)}</CardTitle>
                    <CardDescription>Terapi Planı</CardDescription>
                  </div>
                  {getStatusBadge(plan.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{plan.psychologistId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Oluşturulma: {plan.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Süre: {plan.timeline}</span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hedefler:</h4>
                    <div className="space-y-1">
                      {plan.goals.slice(0, 3).map((goal, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="line-clamp-1">{goal}</span>
                        </div>
                      ))}
                      {plan.goals.length > 3 && (
                        <p className="text-sm text-gray-500">+{plan.goals.length - 3} hedef daha...</p>
                      )}
                    </div>
                  </div>

                  {plan.progress && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">İlerleme:</p>
                      <p className="text-sm text-green-700">{plan.progress}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Görüntüle
                  </Button>
                  <div className="flex items-center gap-2">
                    {plan.status === "active" && (
                      <Button variant="default" size="sm" onClick={() => handleCompletePlan(plan.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Tamamla
                      </Button>
                    )}
                    {hasPermission("therapy_plans") && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePlan(plan.id)}>
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

        {filteredPlans.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Terapi Planı Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Arama kriterlerinize uygun plan bulunamadı." : "Henüz terapi planı eklenmemiş."}
              </p>
              {hasPermission("therapy_plans") && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Planı Oluştur
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan && `Terapi Planı - ${getPatientName(selectedPlan.patientId)}`}</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Plan Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Hasta:</strong> {getPatientName(selectedPlan.patientId)}
                    </p>
                    <p>
                      <strong>Psikolog:</strong> {selectedPlan.psychologistId}
                    </p>
                    <p>
                      <strong>Oluşturulma:</strong> {selectedPlan.createdDate}
                    </p>
                    <p>
                      <strong>Süre:</strong> {selectedPlan.timeline}
                    </p>
                    <p>
                      <strong>Gözden Geçirme:</strong> {selectedPlan.reviewDate}
                    </p>
                    <p>
                      <strong>Durum:</strong> {getStatusBadge(selectedPlan.status)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">İlerleme</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedPlan.progress || "İlerleme kaydı bulunmuyor"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Tedavi Hedefleri</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {selectedPlan.goals.map((goal, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Müdahaleler</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {selectedPlan.interventions.map((intervention, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Therapy Plan Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Terapi Planı Oluştur</DialogTitle>
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
                <label className="text-sm font-medium">Süre</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Süre seçin</option>
                  <option value="4 hafta">4 hafta</option>
                  <option value="8 hafta">8 hafta</option>
                  <option value="12 hafta">12 hafta</option>
                  <option value="16 hafta">16 hafta</option>
                  <option value="6 ay">6 ay</option>
                  <option value="1 yıl">1 yıl</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tedavi Hedefleri</label>
              <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Her satıra bir hedef yazın..." />
            </div>
            <div>
              <label className="text-sm font-medium">Müdahaleler</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Kullanılacak müdahale yöntemleri..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gözden Geçirme Tarihi</label>
              <Input type="date" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowForm(false)}>Oluştur</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
