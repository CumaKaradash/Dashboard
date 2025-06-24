"use client"

import { AuthGuard } from "@/components/auth-guard"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { NotificationCenter, useNotifications } from "@/components/notifications/notification-center"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Settings,
  Bell,
  LogOut,
  Download,
  Phone,
  Brain,
  Monitor,
  UserCheck,
  Stethoscope,
  ClipboardList,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/user-roles"

function DashboardContent() {
  const { user, logout } = usePsychologyAuth()
  const { unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  if (!user) return null

  const getModulesForRole = () => {
    switch (user.role) {
      case "admin":
        return [
          {
            title: "Hasta Yönetimi",
            description: "Hasta kayıtları ve bilgi yönetimi",
            icon: Users,
            href: "/patients",
            color: "bg-blue-500",
            stats: { label: "Aktif Hasta", value: "127" },
          },
          {
            title: "Seans Yönetimi",
            description: "Terapi seansları ve kayıtları",
            icon: Clock,
            href: "/sessions",
            color: "bg-green-500",
            stats: { label: "Bugünkü Seans", value: "8" },
          },
          {
            title: "Finans Yönetimi",
            description: "Gelir, gider ve fatura takibi",
            icon: DollarSign,
            href: "/finance",
            color: "bg-emerald-500",
            stats: { label: "Aylık Gelir", value: "₺45,200" },
          },
          {
            title: "Kullanıcı Yönetimi",
            description: "Sistem kullanıcıları ve yetkileri",
            icon: UserCheck,
            href: "/users",
            color: "bg-purple-500",
            stats: { label: "Aktif Kullanıcı", value: "12" },
          },
          {
            title: "Sistem Ayarları",
            description: "Genel sistem konfigürasyonu",
            icon: Settings,
            href: "/settings",
            color: "bg-gray-500",
            stats: { label: "Modül", value: "7" },
          },
        ]

      case "it_manager":
        return [
          {
            title: "Sistem İzleme",
            description: "Sistem performansı ve durum takibi",
            icon: Monitor,
            href: "/system-monitoring",
            color: "bg-blue-500",
            stats: { label: "Uptime", value: "99.9%" },
          },
          {
            title: "Kullanıcı Yönetimi",
            description: "Kullanıcı hesapları ve erişim yönetimi",
            icon: Users,
            href: "/users",
            color: "bg-green-500",
            stats: { label: "Aktif Kullanıcı", value: "12" },
          },
          {
            title: "Teknik Raporlar",
            description: "Sistem raporları ve analitik",
            icon: FileText,
            href: "/technical-reports",
            color: "bg-purple-500",
            stats: { label: "Rapor", value: "24" },
          },
          {
            title: "Güvenlik Ayarları",
            description: "Sistem güvenliği ve yedekleme",
            icon: Settings,
            href: "/security",
            color: "bg-red-500",
            stats: { label: "Yedek", value: "Güncel" },
          },
        ]

      case "secretary":
        return [
          {
            title: "Randevu Yönetimi",
            description: "Hasta randevuları ve takvim",
            icon: Calendar,
            href: "/appointments",
            color: "bg-blue-500",
            stats: { label: "Bugünkü Randevu", value: "15" },
          },
          {
            title: "Hasta Kaydı",
            description: "Yeni hasta kayıtları ve bilgi girişi",
            icon: Users,
            href: "/patients",
            color: "bg-green-500",
            stats: { label: "Yeni Hasta", value: "3" },
          },
          {
            title: "Telefon Kayıtları",
            description: "Gelen ve giden telefon görüşmeleri",
            icon: Phone,
            href: "/phone-logs",
            color: "bg-purple-500",
            stats: { label: "Bugünkü Arama", value: "12" },
          },
          {
            title: "Finans Takibi",
            description: "Ödeme kayıtları ve fatura takibi",
            icon: DollarSign,
            href: "/finance",
            color: "bg-emerald-500",
            stats: { label: "Bekleyen Ödeme", value: "₺3,400" },
          },
          {
            title: "Doküman Yönetimi",
            description: "Hasta dosyaları ve belgeler",
            icon: FileText,
            href: "/documents",
            color: "bg-orange-500",
            stats: { label: "Belge", value: "89" },
          },
        ]

      case "assistant_psychologist":
        return [
          {
            title: "Hasta Randevuları",
            description: "Randevu takibi ve planlama",
            icon: Calendar,
            href: "/appointments",
            color: "bg-blue-500",
            stats: { label: "Bu Hafta", value: "12" },
          },
          {
            title: "Seans Notları",
            description: "Seans kayıtları ve notlar",
            icon: ClipboardList,
            href: "/sessions",
            color: "bg-green-500",
            stats: { label: "Tamamlanan", value: "8" },
          },
          {
            title: "Hasta Dosyaları",
            description: "Temel hasta bilgileri",
            icon: Users,
            href: "/patients",
            color: "bg-purple-500",
            stats: { label: "Takip Edilen", value: "25" },
          },
          {
            title: "Süpervizyon",
            description: "Süpervizyon kayıtları",
            icon: Brain,
            href: "/supervision",
            color: "bg-yellow-500",
            stats: { label: "Bu Ay", value: "4" },
          },
        ]

      case "psychologist":
        return [
          {
            title: "Hasta Yönetimi",
            description: "Hasta takibi ve tedavi planları",
            icon: Users,
            href: "/patients",
            color: "bg-blue-500",
            stats: { label: "Aktif Hasta", value: "32" },
          },
          {
            title: "Seans Kayıtları",
            description: "Terapi seansları ve değerlendirmeler",
            icon: Brain,
            href: "/sessions",
            color: "bg-green-500",
            stats: { label: "Bu Hafta", value: "18" },
          },
          {
            title: "Finans Görünümü",
            description: "Gelir takibi ve mali durum",
            icon: DollarSign,
            href: "/finance",
            color: "bg-emerald-500",
            stats: { label: "Bu Ay", value: "₺12,800" },
          },
          {
            title: "Psikolojik Değerlendirme",
            description: "Test ve değerlendirme sonuçları",
            icon: Stethoscope,
            href: "/assessments",
            color: "bg-purple-500",
            stats: { label: "Bekleyen", value: "5" },
          },
          {
            title: "Terapi Planları",
            description: "Tedavi planları ve hedefler",
            icon: ClipboardList,
            href: "/therapy-plans",
            color: "bg-orange-500",
            stats: { label: "Aktif Plan", value: "28" },
          },
        ]

      default:
        return []
    }
  }

  const modules = getModulesForRole()

  const recentActivities = [
    { type: "session", message: "Yeni seans kaydı eklendi", time: "5 dk önce", patient: "Ayşe Y." },
    { type: "payment", message: "Ödeme alındı", time: "8 dk önce", patient: "Can D.", amount: "₺350" },
    { type: "appointment", message: "Randevu iptal edildi", time: "12 dk önce", patient: "Can D." },
    { type: "patient", message: "Yeni hasta kaydı", time: "25 dk önce", patient: "Mehmet K." },
    { type: "phone", message: "Telefon görüşmesi kaydedildi", time: "1 saat önce", caller: "Fatma A." },
  ]

  const quickStats = [
    { label: "Bugünkü Randevu", value: "15", change: "+3", positive: true },
    { label: "Aktif Hasta", value: "127", change: "+8", positive: true },
    { label: "Aylık Gelir", value: "₺45,200", change: "+12%", positive: true },
    { label: "Bekleyen Ödeme", value: "₺3,400", change: "-₺800", positive: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PsiKlinik Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600">Hoş geldiniz, {user?.name}</p>
              <Badge className={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor Al
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)} className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs min-w-[20px] h-5">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Badge variant={stat.positive ? "default" : "destructive"} className="bg-green-100 text-green-800">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ana Modüller</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, index) => {
                const IconComponent = module.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                          <IconComponent className={`w-6 h-6 ${module.color.replace("bg-", "text-")}`} />
                        </div>
                        <Badge variant="secondary">{module.stats.value}</Badge>
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{module.stats.label}</span>
                        <Link href={module.href}>
                          <Button variant="outline" size="sm">
                            Görüntüle
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Son Aktiviteler</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            {activity.patient && (
                              <Badge variant="outline" className="text-xs">
                                {activity.patient}
                              </Badge>
                            )}
                            {activity.caller && (
                              <Badge variant="outline" className="text-xs">
                                {activity.caller}
                              </Badge>
                            )}
                            {activity.amount && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                {activity.amount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.role === "secretary" && (
                  <>
                    <Link href="/appointments?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Randevu Oluştur
                      </Button>
                    </Link>
                    <Link href="/patients?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Hasta Kaydet
                      </Button>
                    </Link>
                    <Link href="/finance?action=payment">
                      <Button className="w-full justify-start" variant="outline">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Ödeme Kaydet
                      </Button>
                    </Link>
                    <Link href="/phone-logs?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Telefon Kaydı
                      </Button>
                    </Link>
                  </>
                )}
                {(user.role === "psychologist" || user.role === "assistant_psychologist") && (
                  <>
                    <Link href="/sessions?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Brain className="w-4 h-4 mr-2" />
                        Seans Kaydet
                      </Button>
                    </Link>
                    <Link href="/patients">
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Hasta Listesi
                      </Button>
                    </Link>
                    <Link href="/assessments?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Değerlendirme Ekle
                      </Button>
                    </Link>
                    {user.role === "psychologist" && (
                      <Link href="/finance">
                        <Button className="w-full justify-start" variant="outline">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Mali Durum
                        </Button>
                      </Link>
                    )}
                  </>
                )}
                {user.role === "it_manager" && (
                  <>
                    <Link href="/system-monitoring">
                      <Button className="w-full justify-start" variant="outline">
                        <Monitor className="w-4 h-4 mr-2" />
                        Sistem Durumu
                      </Button>
                    </Link>
                    <Link href="/users">
                      <Button className="w-full justify-start" variant="outline">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Kullanıcı Yönetimi
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Sistem Ayarları
                      </Button>
                    </Link>
                  </>
                )}
                {user.role === "admin" && (
                  <>
                    <Link href="/patients?action=add">
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Yeni Hasta
                      </Button>
                    </Link>
                    <Link href="/finance">
                      <Button className="w-full justify-start" variant="outline">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Finans Yönetimi
                      </Button>
                    </Link>
                    <Link href="/users">
                      <Button className="w-full justify-start" variant="outline">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Kullanıcı Yönetimi
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Sistem Ayarları
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
