"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Shield, Database, Globe, Clock, Save, RefreshCw, Download, Upload } from "lucide-react"
import Link from "next/link"
import { usePsychologyAuth } from "@/hooks/use-psychology-auth"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    clinicName: "PsiKlinik Merkez",
    clinicAddress: "Atatürk Cad. No:123 Çankaya/Ankara",
    clinicPhone: "+90 312 123 45 67",
    clinicEmail: "info@psiklinik.com",
    workingHours: {
      start: "09:00",
      end: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
    },
    timezone: "Europe/Istanbul",
    language: "tr",
    currency: "TRY",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentReminders: true,
    systemAlerts: true,
    reminderTime: 24, // hours before appointment

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    loginAttempts: 5,
    dataEncryption: true,
    auditLog: true,

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    debugMode: false,
    performanceMonitoring: true,
    errorReporting: true,
  })

  const { user, hasPermission } = usePsychologyAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      // Simulate loading settings from API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Settings are already initialized above
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate saving settings to API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Başarılı",
        description: "Ayarlar kaydedildi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "psiklinik-settings.json"
    link.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Başarılı",
      description: "Ayarlar dışa aktarıldı",
    })
  }

  const handleImportSettings = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string)
            setSettings({ ...settings, ...importedSettings })
            toast({
              title: "Başarılı",
              description: "Ayarlar içe aktarıldı",
            })
          } catch (error) {
            toast({
              title: "Hata",
              description: "Geçersiz ayar dosyası",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  if (!hasPermission("system_settings")) {
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

  if (loading && Object.keys(settings).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ayarlar yükleniyor...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-gray-600">Genel sistem konfigürasyonu ve tercihler</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleImportSettings}>
              <Upload className="w-4 h-4 mr-2" />
              İçe Aktar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button size="sm" onClick={handleSaveSettings} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Genel</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Klinik Bilgileri
                </CardTitle>
                <CardDescription>Klinik hakkında temel bilgiler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Klinik Adı</label>
                    <Input
                      value={settings.clinicName}
                      onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefon</label>
                    <Input
                      value={settings.clinicPhone}
                      onChange={(e) => setSettings({ ...settings, clinicPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Adres</label>
                  <Input
                    value={settings.clinicAddress}
                    onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">E-posta</label>
                  <Input
                    type="email"
                    value={settings.clinicEmail}
                    onChange={(e) => setSettings({ ...settings, clinicEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Çalışma Saatleri
                </CardTitle>
                <CardDescription>Klinik çalışma saatleri ve molalar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Başlangıç Saati</label>
                    <Input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          workingHours: { ...settings.workingHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bitiş Saati</label>
                    <Input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          workingHours: { ...settings.workingHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Öğle Molası Başlangıç</label>
                    <Input
                      type="time"
                      value={settings.workingHours.lunchStart}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          workingHours: { ...settings.workingHours, lunchStart: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Öğle Molası Bitiş</label>
                    <Input
                      type="time"
                      value={settings.workingHours.lunchEnd}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          workingHours: { ...settings.workingHours, lunchEnd: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bölgesel Ayarlar</CardTitle>
                <CardDescription>Dil, saat dilimi ve para birimi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dil</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Saat Dilimi</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    >
                      <option value="Europe/Istanbul">İstanbul</option>
                      <option value="Europe/London">Londra</option>
                      <option value="America/New_York">New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Para Birimi</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    >
                      <option value="TRY">Türk Lirası (₺)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildirim Tercihleri
                </CardTitle>
                <CardDescription>Sistem bildirimleri ve hatırlatmalar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">E-posta Bildirimleri</h4>
                    <p className="text-sm text-gray-600">Sistem olayları için e-posta gönder</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Bildirimleri</h4>
                    <p className="text-sm text-gray-600">Önemli olaylar için SMS gönder</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Randevu Hatırlatmaları</h4>
                    <p className="text-sm text-gray-600">Hastalara randevu hatırlatması gönder</p>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ödeme Hatırlatmaları</h4>
                    <p className="text-sm text-gray-600">Bekleyen ödemeler için hatırlatma gönder</p>
                  </div>
                  <Switch
                    checked={settings.paymentReminders}
                    onCheckedChange={(checked) => setSettings({ ...settings, paymentReminders: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sistem Uyarıları</h4>
                    <p className="text-sm text-gray-600">Sistem hataları ve uyarıları</p>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hatırlatma Zamanı (saat önce)</label>
                  <Input
                    type="number"
                    value={settings.reminderTime}
                    onChange={(e) => setSettings({ ...settings, reminderTime: Number.parseInt(e.target.value) })}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Güvenlik Ayarları
                </CardTitle>
                <CardDescription>Sistem güvenliği ve erişim kontrolü</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">İki Faktörlü Doğrulama</h4>
                    <p className="text-sm text-gray-600">Giriş için ek güvenlik katmanı</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Veri Şifreleme</h4>
                    <p className="text-sm text-gray-600">Hassas verileri şifrele</p>
                  </div>
                  <Switch
                    checked={settings.dataEncryption}
                    onCheckedChange={(checked) => setSettings({ ...settings, dataEncryption: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Denetim Günlüğü</h4>
                    <p className="text-sm text-gray-600">Kullanıcı işlemlerini kaydet</p>
                  </div>
                  <Switch
                    checked={settings.auditLog}
                    onCheckedChange={(checked) => setSettings({ ...settings, auditLog: checked })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Oturum Zaman Aşımı (dakika)</label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Şifre Geçerlilik (gün)</label>
                    <Input
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({ ...settings, passwordExpiry: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maksimum Giriş Denemesi</label>
                    <Input
                      type="number"
                      value={settings.loginAttempts}
                      onChange={(e) => setSettings({ ...settings, loginAttempts: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Sistem Ayarları
                </CardTitle>
                <CardDescription>Yedekleme, bakım ve performans ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Otomatik Yedekleme</h4>
                    <p className="text-sm text-gray-600">Düzenli veri yedeklemesi</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Performans İzleme</h4>
                    <p className="text-sm text-gray-600">Sistem performansını izle</p>
                  </div>
                  <Switch
                    checked={settings.performanceMonitoring}
                    onCheckedChange={(checked) => setSettings({ ...settings, performanceMonitoring: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Hata Raporlama</h4>
                    <p className="text-sm text-gray-600">Otomatik hata raporları gönder</p>
                  </div>
                  <Switch
                    checked={settings.errorReporting}
                    onCheckedChange={(checked) => setSettings({ ...settings, errorReporting: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bakım Modu</h4>
                    <p className="text-sm text-gray-600">Sistemi bakım moduna al</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Debug Modu</h4>
                    <p className="text-sm text-gray-600">Geliştirici hata ayıklama</p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Yedekleme Sıklığı</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  >
                    <option value="hourly">Saatlik</option>
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
