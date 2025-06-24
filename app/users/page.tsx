"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Users, UserCheck, Shield, Edit, Trash2, Eye, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"
import { ROLE_LABELS, ROLE_COLORS, type UserRole } from "@/lib/user-roles"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  department: string
  status: "active" | "inactive" | "suspended"
  lastLogin?: string
  createdAt: string
  avatar?: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([
    {
      id: "user_001",
      name: "Dr. Ahmet Özkan",
      email: "ahmet.ozkan@psiklinik.com",
      phone: "+90 532 123 45 67",
      role: "psychologist",
      department: "Klinik Psikoloji",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      createdAt: "2023-06-15",
    },
    {
      id: "user_002",
      name: "Psikolog Ayşe Demir",
      email: "ayse.demir@psiklinik.com",
      phone: "+90 532 234 56 78",
      role: "assistant_psychologist",
      department: "Klinik Psikoloji",
      status: "active",
      lastLogin: "2024-01-15 16:45",
      createdAt: "2023-08-20",
    },
    {
      id: "user_003",
      name: "Sekreter Fatma Yılmaz",
      email: "fatma.yilmaz@psiklinik.com",
      phone: "+90 532 345 67 89",
      role: "secretary",
      department: "İdari",
      status: "active",
      lastLogin: "2024-01-15 17:20",
      createdAt: "2023-05-10",
    },
    {
      id: "user_004",
      name: "Mehmet Kaya",
      email: "mehmet.kaya@psiklinik.com",
      phone: "+90 532 456 78 90",
      role: "it_manager",
      department: "Bilgi İşlem",
      status: "active",
      lastLogin: "2024-01-15 09:15",
      createdAt: "2023-04-01",
    },
    {
      id: "user_005",
      name: "Admin User",
      email: "admin@psiklinik.com",
      role: "admin",
      department: "Yönetim",
      status: "active",
      lastLogin: "2024-01-15 18:00",
      createdAt: "2023-01-01",
    },
  ])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        setUsers(users.filter((u) => u.id !== id))
        toast({
          title: "Başarılı",
          description: "Kullanıcı silindi",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Kullanıcı silinirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const handleStatusChange = (id: string, status: "active" | "inactive" | "suspended") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)))
    toast({
      title: "Başarılı",
      description: "Kullanıcı durumu güncellendi",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>
      case "suspended":
        return <Badge variant="destructive">Askıya Alındı</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    psychologists: users.filter((u) => u.role === "psychologist" || u.role === "assistant_psychologist").length,
    adminUsers: users.filter((u) => u.role === "admin" || u.role === "it_manager").length,
  }

  if (!hasPermission("user_management")) {
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
            <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600">Sistem kullanıcıları ve yetkileri</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kullanıcı
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
                  <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Psikolog</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.psychologists}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Yönetici</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
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
                placeholder="Kullanıcı adı, e-posta veya departman ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Listesi</CardTitle>
            <CardDescription>Tüm sistem kullanıcıları ve rolleri</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Son Giriş</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{user.lastLogin || "Hiç giriş yapmadı"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.id !== "user_005" && (
                          <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser && `${selectedUser.name} - Kullanıcı Detayları`}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-blue-600">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <Badge className={ROLE_COLORS[selectedUser.role]}>{ROLE_LABELS[selectedUser.role]}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">İletişim Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sistem Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Departman:</strong> {selectedUser.department}
                    </p>
                    <p>
                      <strong>Durum:</strong> {getStatusBadge(selectedUser.status)}
                    </p>
                    <p>
                      <strong>Kayıt Tarihi:</strong> {selectedUser.createdAt}
                    </p>
                    <p>
                      <strong>Son Giriş:</strong> {selectedUser.lastLogin || "Hiç giriş yapmadı"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Durum Değiştir</h4>
                <div className="flex gap-2">
                  <Button
                    variant={selectedUser.status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedUser.id, "active")}
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={selectedUser.status === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedUser.id, "inactive")}
                  >
                    Pasif
                  </Button>
                  <Button
                    variant={selectedUser.status === "suspended" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedUser.id, "suspended")}
                  >
                    Askıya Al
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ad Soyad</label>
                <Input placeholder="Ahmet Özkan" defaultValue={selectedUser?.name} />
              </div>
              <div>
                <label className="text-sm font-medium">E-posta</label>
                <Input type="email" placeholder="ahmet@psiklinik.com" defaultValue={selectedUser?.email} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Telefon</label>
                <Input placeholder="+90 532 123 45 67" defaultValue={selectedUser?.phone} />
              </div>
              <div>
                <label className="text-sm font-medium">Departman</label>
                <Input placeholder="Klinik Psikoloji" defaultValue={selectedUser?.department} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Rol</label>
                <select className="w-full p-2 border rounded-md" defaultValue={selectedUser?.role}>
                  <option value="psychologist">Psikolog</option>
                  <option value="assistant_psychologist">Asistan Psikolog</option>
                  <option value="secretary">Sekreter</option>
                  <option value="it_manager">Bilgi İşlem Uzmanı</option>
                  <option value="admin">Sistem Yöneticisi</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <select className="w-full p-2 border rounded-md" defaultValue={selectedUser?.status || "active"}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="suspended">Askıya Alındı</option>
                </select>
              </div>
            </div>
            {!selectedUser && (
              <div>
                <label className="text-sm font-medium">Geçici Şifre</label>
                <Input type="password" placeholder="Güvenli şifre oluşturun" />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                İptal
              </Button>
              <Button onClick={() => setShowForm(false)}>{selectedUser ? "Güncelle" : "Oluştur"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
