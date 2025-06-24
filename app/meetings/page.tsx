"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Calendar, Clock, MapPin, FileText, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Meeting } from "@/lib/database"
import { DatabaseOperations } from "@/lib/database-operations"

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [meetings, setMeetings] = useState<Meeting[]>([])

  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = () => {
    const allMeetings = DatabaseOperations.meetings.getAll()
    setMeetings(allMeetings)
  }

  const handleEditMeeting = (meeting: Meeting) => {
    alert(`Toplantı düzenleme özelliği geliştiriliyor...\n\nToplantı: ${meeting.title}`)
  }

  const handleDeleteMeeting = (id: string) => {
    if (confirm("Bu toplantıyı silmek istediğinizden emin misiniz?")) {
      DatabaseOperations.meetings.delete(id)
      loadMeetings()
    }
  }

  const handleJoinMeeting = (meeting: Meeting) => {
    DatabaseOperations.meetings.update(meeting.id, { status: "completed" })
    loadMeetings()
    alert(`${meeting.title} toplantısına katıldınız!`)
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
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalMeetings: meetings.length,
    scheduled: meetings.filter((m) => m.status === "scheduled").length,
    completed: meetings.filter((m) => m.status === "completed").length,
    cancelled: meetings.filter((m) => m.status === "cancelled").length,
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
            <h1 className="text-2xl font-bold text-gray-900">Toplantı Yönetimi</h1>
            <p className="text-gray-600">Toplantı planlama ve takip sistemi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Takvim Görünümü
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Toplantı
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
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Toplantı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
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
                  <Clock className="w-6 h-6 text-yellow-600" />
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
                  <p className="text-sm font-medium text-gray-600">İptal</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Toplantı başlığı, açıklama veya konum ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMeetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <CardDescription className="mt-1">{meeting.description}</CardDescription>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {meeting.time} ({meeting.duration} dakika)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{meeting.attendees.length} katılımcı</span>
                  </div>

                  {meeting.agenda && meeting.agenda.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Gündem:
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {meeting.agenda.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Katılımcılar:</div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditMeeting(meeting)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteMeeting(meeting.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Sil
                      </Button>
                    </div>
                    {meeting.status === "scheduled" && (
                      <Button size="sm" onClick={() => handleJoinMeeting(meeting)}>
                        Katıl
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
