"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, Clock, User, Phone, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AppointmentForm } from "@/components/forms/appointment-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DatabaseOperations, type Appointment } from "@/lib/database"
import { useSearchParams } from "next/navigation"

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("2024-01-15")

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>()
  const searchParams = useSearchParams()

  useEffect(() => {
    loadAppointments()
    if (searchParams.get("action") === "add") {
      setShowForm(true)
    }
  }, [searchParams])

  const loadAppointments = () => {
    const allAppointments = DatabaseOperations.appointments.getAll()
    setAppointments(allAppointments)
  }

  const handleAddAppointment = () => {
    setEditingAppointment(undefined)
    setShowForm(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) {
      DatabaseOperations.appointments.delete(id)
      loadAppointments()
    }
  }

  const handleFormSubmit = (appointment: Appointment) => {
    setShowForm(false)
    setEditingAppointment(undefined)
    loadAppointments()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingAppointment(undefined)
  }

  const handleStatusUpdate = (id: string, status: string) => {
    DatabaseOperations.appointments.update(id, { status })
    loadAppointments()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Onaylandı
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Bekliyor
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.staff.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalToday: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Randevu Yönetimi</h1>
            <p className="text-gray-600">Online rezervasyon ve takvim yönetimi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Takvim Görünümü
            </Button>
            <Button size="sm" onClick={handleAddAppointment}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Randevu
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
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bugün Toplam</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
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
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">İptal</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Time Slots */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tarih Seçimi</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold">15 Ocak 2024</p>
                  <p className="text-sm text-gray-600">Pazartesi</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zaman Dilimi</CardTitle>
                <CardDescription>Müsait saatleri görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => {
                    const hasAppointment = appointments.some((apt) => apt.time === time)
                    return (
                      <Button
                        key={time}
                        variant={hasAppointment ? "default" : "outline"}
                        size="sm"
                        className={hasAppointment ? "bg-blue-600" : ""}
                      >
                        {time}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Müşteri adı, hizmet veya personel ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrele
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Bugünün Randevuları</CardTitle>
                <CardDescription>15 Ocak 2024 tarihli randevular</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{appointment.clientName}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {appointment.clientPhone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {appointment.time} ({appointment.duration} dk)
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {appointment.staff}
                            </div>
                            <div>
                              <Badge variant="outline">{appointment.service}</Badge>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 text-sm text-gray-500">
                              <strong>Not:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditAppointment(appointment)}>
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? "Randevu Düzenle" : "Yeni Randevu Oluştur"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm appointment={editingAppointment} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
