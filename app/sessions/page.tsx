"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Clock, User, Calendar, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type Session, type Patient } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { SessionForm } from "@/components/forms/session-form"

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("2024-01-15")
  const [sessions, setSessions] = useState<Session[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { user, hasPermission } = usePsychologyAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
    loadPatients()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/sessions")
      const data = await res.json()
      setSessions(data)
    } finally {
      setLoading(false)
    }
  }

  const loadPatients = () => {
    const allPatients = PsychologyDatabase.patients.getAll()
    setPatients(allPatients)
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : "Bilinmeyen Hasta"
  }

  const handleViewSession = (session: Session) => {
    setSelectedSession(session)
    setShowDetails(true)
  }

  const handleEditSession = (session: Session) => {
    alert(`Seans düzenleme özelliği geliştiriliyor...\n\nSeans ID: ${session.id}`)
  }

  const handleDeleteSession = (id: string) => {
    if (confirm("Bu seansı silmek istediğinizden emin misiniz?")) {
      PsychologyDatabase.sessions.delete(id)
      loadSessions()
    }
  }

  const handleCompleteSession = (id: string) => {
    PsychologyDatabase.sessions.update(id, { status: "completed" })
    loadSessions()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Planlandı</Badge>
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>
      case "no_show":
        return <Badge className="bg-yellow-100 text-yellow-800">Gelmedi</Badge>
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
      case "family":
        return "Aile"
      case "assessment":
        return "Değerlendirme"
      default:
        return type
    }
  }

  const handleAdd = () => {
    setEditingSession(null)
    setShowForm(true)
  }

  const handleEdit = (session: Session) => {
    setEditingSession(session)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu seansı silmek istediğinizden emin misiniz?")) {
      await fetch(`/api/sessions/${id}`, { method: "DELETE" })
      loadSessions()
    }
  }

  const handleFormSubmit = async (session: Session) => {
    if (editingSession) {
      await fetch(`/api/sessions/${editingSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      })
    } else {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      })
    }
    setShowForm(false)
    loadSessions()
  }

  const filteredSessions = sessions.filter((session) =>
    session.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.psychologistId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const todaySessions = sessions.filter((s) => s.date === selectedDate)
  const stats = {
    totalSessions: sessions.length,
    todaySessions: todaySessions.length,
    completedToday: todaySessions.filter((s) => s.status === "completed").length,
    scheduledToday: todaySessions.filter((s) => s.status === "scheduled").length,
  }

  if (!hasPermission("session_records") && !hasPermission("session_notes")) {
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
            <h1 className="text-2xl font-bold text-gray-900">Seans Yönetimi</h1>
            <p className="text-gray-600">Terapi seansları ve kayıtları</p>
          </div>
          <div className="flex items-center gap-3">
            {hasPermission("session_records") && (
              <Button size="sm" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Seans
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
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Seans</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
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
                  <p className="text-sm font-medium text-gray-600">Bugün</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todaySessions}</p>
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
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduledToday}</p>
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
                    placeholder="Hasta adı veya psikolog ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Seans Listesi</CardTitle>
            <CardDescription>{selectedDate} tarihli seanslar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Hasta</th>
                    <th className="text-left p-4 font-medium text-gray-900">Psikolog</th>
                    <th className="text-left p-4 font-medium text-gray-900">Saat</th>
                    <th className="text-left p-4 font-medium text-gray-900">Süre</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tür</th>
                    <th className="text-left p-4 font-medium text-gray-900">Durum</th>
                    <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSessions
                    .filter((s) => s.date === selectedDate)
                    .map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{getPatientName(session.patientId)}</div>
                        </td>
                        <td className="p-4 text-gray-600">{session.psychologistId}</td>
                        <td className="p-4 text-gray-600">
                          {session.startTime} - {session.endTime}
                        </td>
                        <td className="p-4 text-gray-600">{session.duration} dk</td>
                        <td className="p-4">
                          <Badge variant="outline">{getTypeLabel(session.type)}</Badge>
                        </td>
                        <td className="p-4">{getStatusBadge(session.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewSession(session)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission("session_records") && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleEdit(session)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {session.status === "scheduled" && (
                                  <Button variant="default" size="sm" onClick={() => handleCompleteSession(session.id)}>
                                    Tamamla
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSession && `Seans Detayları - ${getPatientName(selectedSession.patientId)}`}
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Seans Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Hasta:</strong> {getPatientName(selectedSession.patientId)}
                    </p>
                    <p>
                      <strong>Psikolog:</strong> {selectedSession.psychologistId}
                    </p>
                    <p>
                      <strong>Tarih:</strong> {selectedSession.date}
                    </p>
                    <p>
                      <strong>Saat:</strong> {selectedSession.startTime} - {selectedSession.endTime}
                    </p>
                    <p>
                      <strong>Süre:</strong> {selectedSession.duration} dakika
                    </p>
                    <p>
                      <strong>Tür:</strong> {getTypeLabel(selectedSession.type)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Durum</h3>
                  <div className="space-y-2">
                    {getStatusBadge(selectedSession.status)}
                    {selectedSession.mood && (
                      <p className="text-sm">
                        <strong>Ruh Hali:</strong> {selectedSession.mood}/10
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSession.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Seans Notları</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedSession.notes}</p>
                </div>
              )}

              {selectedSession.interventions && selectedSession.interventions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Müdahaleler</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.interventions.map((intervention, index) => (
                      <Badge key={index} variant="outline">
                        {intervention}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedSession.homework && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Ev Ödevi</h3>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg">{selectedSession.homework}</p>
                </div>
              )}

              {selectedSession.nextSessionPlan && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Sonraki Seans Planı</h3>
                  <p className="text-sm bg-green-50 p-3 rounded-lg">{selectedSession.nextSessionPlan}</p>
                </div>
              )}

              {selectedSession.progress && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">İlerleme</h3>
                  <p className="text-sm bg-purple-50 p-3 rounded-lg">{selectedSession.progress}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSession ? "Seans Düzenle" : "Yeni Seans Ekle"}</DialogTitle>
          </DialogHeader>
          <SessionForm
            session={editingSession ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
