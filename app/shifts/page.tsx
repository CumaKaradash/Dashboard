"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Clock, Users, Calendar, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DatabaseOperations, type Shift } from "@/lib/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSearchParams } from "next/navigation"
import ShiftForm from "./shift-form"

export default function ShiftsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("2024-01-15")
  const [shifts, setShifts] = useState<Shift[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    loadShifts()
    if (searchParams.get("action") === "add") {
      setShowForm(true)
    }
  }, [searchParams])

  const loadShifts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/shifts")
      const data = await res.json()
      setShifts(data)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Tamamlandı
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Planlandı
          </Badge>
        )
      case "absent":
        return <Badge variant="destructive">Gelmedi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredShifts = shifts.filter(
    (shift) =>
      shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalShifts: shifts.length,
    scheduled: shifts.filter((s) => s.status === "scheduled").length,
    completed: shifts.filter((s) => s.status === "completed").length,
    absent: shifts.filter((s) => s.status === "absent").length,
  }

  const handleAdd = () => {
    setEditingShift(null)
    setShowForm(true)
  }

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu vardiyayı silmek istediğinizden emin misiniz?")) {
      await fetch(`/api/shifts/${id}`, { method: "DELETE" })
      loadShifts()
    }
  }

  const handleFormSubmit = async (shift: Shift) => {
    if (editingShift) {
      await fetch(`/api/shifts/${editingShift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shift),
      })
    } else {
      await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shift),
      })
    }
    setShowForm(false)
    loadShifts()
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
            <h1 className="text-2xl font-bold text-gray-900">Vardiya Planlama</h1>
            <p className="text-gray-600">Personel vardiya çizelgeleri ve mesai takibi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Haftalık Görünüm
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Vardiya
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
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Vardiya</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Planlandı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
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
                  <p className="text-sm font-medium text-gray-600">Tamamlandı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gelmedi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Date Navigation */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tarih</span>
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
                <div className="text-center">
                  <p className="text-lg font-semibold">15 Ocak 2024</p>
                  <p className="text-sm text-gray-600">Pazartesi</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Vardiya Ekle
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Haftalık Plan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Personel Listesi
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Shifts List */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Personel adı veya pozisyon ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Durum filtrele" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Durumlar</SelectItem>
                      <SelectItem value="scheduled">Planlandı</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="absent">Gelmedi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vardiya Listesi</CardTitle>
                <CardDescription>15 Ocak 2024 tarihli vardiyalar</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Personel</th>
                        <th className="text-left p-4 font-medium text-gray-900">Pozisyon</th>
                        <th className="text-left p-4 font-medium text-gray-900">Başlangıç</th>
                        <th className="text-left p-4 font-medium text-gray-900">Bitiş</th>
                        <th className="text-left p-4 font-medium text-gray-900">Süre</th>
                        <th className="text-left p-4 font-medium text-gray-900">Durum</th>
                        <th className="text-left p-4 font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredShifts.map((shift) => {
                        const startTime = new Date(`2024-01-01 ${shift.startTime}`)
                        const endTime = new Date(`2024-01-01 ${shift.endTime}`)
                        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

                        return (
                          <tr key={shift.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{shift.employeeName}</div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">{shift.position}</Badge>
                            </td>
                            <td className="p-4 text-gray-600">{shift.startTime}</td>
                            <td className="p-4 text-gray-600">{shift.endTime}</td>
                            <td className="p-4 text-gray-600">{duration} saat</td>
                            <td className="p-4">{getStatusBadge(shift.status)}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(shift)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(shift.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingShift ? "Vardiya Düzenle" : "Yeni Vardiya Ekle"}</DialogTitle>
          </DialogHeader>
          <ShiftForm
            shift={editingShift ?? undefined}
            onSubmit={(shift) => { handleFormSubmit(shift); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
