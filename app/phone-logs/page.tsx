"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Phone, Clock, User, MessageSquare, Edit, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PsychologyDatabase, type PhoneLog } from "@/lib/psychology-database"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"

export default function PhoneLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [phoneLogs, setPhoneLogs] = useState<PhoneLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const { user, hasPermission } = usePsychologyAuth()

  useEffect(() => {
    loadPhoneLogs()
  }, [])

  const loadPhoneLogs = () => {
    const allLogs = PsychologyDatabase.phoneLogs.getAll()
    setPhoneLogs(allLogs)
  }

  const handleAddLog = () => {
    setShowForm(true)
  }

  const handleCompleteLog = (id: string) => {
    PsychologyDatabase.phoneLogs.update(id, { status: "completed" })
    loadPhoneLogs()
  }

  const handleDeleteLog = (id: string) => {
    if (confirm("Bu telefon kaydını silmek istediğinizden emin misiniz?")) {
      PsychologyDatabase.phoneLogs.delete(id)
      loadPhoneLogs()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Bekliyor</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredLogs = phoneLogs.filter(
    (log) =>
      log.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.callerPhone.includes(searchTerm) ||
      log.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalCalls: phoneLogs.length,
    todayCalls: phoneLogs.filter((log) => log.date === new Date().toISOString().split("T")[0]).length,
    pendingFollowUp: phoneLogs.filter((log) => log.followUpRequired && log.status === "pending").length,
  }

  if (!hasPermission("phone_logs")) {
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
            <h1 className="text-2xl font-bold text-gray-900">Telefon Kayıtları</h1>
            <p className="text-gray-600">Gelen ve giden telefon görüşmeleri</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleAddLog}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kayıt
            </Button>
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
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Arama</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
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
                  <p className="text-sm font-medium text-gray-600">Bugün</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayCalls}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Takip Gerekli</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingFollowUp}</p>
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
                placeholder="Arayan adı, telefon veya amaç ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Phone Logs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      {log.callerName}
                    </CardTitle>
                    <CardDescription>{log.callerPhone}</CardDescription>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {log.date} - {log.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Amaç: {log.purpose}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 mt-0.5" />
                    <span>{log.message}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>Kaydeden:</strong> {log.takenBy}
                  </div>
                  {log.followUpRequired && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Takip Gerekli
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <div className="flex items-center gap-2">
                    {log.status === "pending" && log.followUpRequired && (
                      <Button variant="default" size="sm" onClick={() => handleCompleteLog(log.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Tamamla
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteLog(log.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Phone Log Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Telefon Kaydı</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Arayan Adı</label>
                <Input placeholder="Ad Soyad" />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon</label>
                <Input placeholder="+90 5XX XXX XX XX" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Amaç</label>
              <Input placeholder="Arama amacı" />
            </div>
            <div>
              <label className="text-sm font-medium">Mesaj</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Görüşme detayları..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="followUp" />
              <label htmlFor="followUp" className="text-sm">
                Takip gerekli
              </label>
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
