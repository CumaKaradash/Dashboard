"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BarChart3,
  PieChart,
  Download,
  Filter,
  AlertTriangle,
  RotateCw,
} from "lucide-react"
import Link from "next/link"

export default function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const kpis = [
    {
      id: 1,
      name: "Satış Hedefi",
      current: 87,
      target: 100,
      unit: "%",
      trend: "up",
      change: "+5%",
      status: "good",
    },
    {
      id: 2,
      name: "Müşteri Memnuniyeti",
      current: 4.2,
      target: 4.5,
      unit: "/5",
      trend: "up",
      change: "+0.3",
      status: "warning",
    },
    {
      id: 3,
      name: "Operasyonel Verimlilik",
      current: 92,
      target: 95,
      unit: "%",
      trend: "down",
      change: "-2%",
      status: "warning",
    },
    {
      id: 4,
      name: "Çalışan Devir Hızı",
      current: 8,
      target: 5,
      unit: "%",
      trend: "up",
      change: "+1%",
      status: "bad",
    },
  ]

  const departmentPerformance = [
    { name: "Satış", score: 92, target: 90, employees: 12 },
    { name: "Pazarlama", score: 88, target: 85, employees: 8 },
    { name: "Operasyon", score: 85, target: 90, employees: 15 },
    { name: "İnsan Kaynakları", score: 90, target: 88, employees: 5 },
    { name: "Finans", score: 95, target: 92, employees: 6 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "bad":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Hedefte"
      case "warning":
        return "Dikkat"
      case "bad":
        return "Kritik"
      default:
        return "Normal"
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const handleRefreshData = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
    alert("Performans verileri güncellendi!")
  }

  const handleDepartmentClick = (department: string) => {
    alert(`${department} departmanı detay raporu geliştiriliyor...`)
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
            <h1 className="text-2xl font-bold text-gray-900">Performans Takibi</h1>
            <p className="text-gray-600">KPI'lar, hedefler ve trend analizi</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Haftalık</SelectItem>
                <SelectItem value="month">Aylık</SelectItem>
                <SelectItem value="quarter">Çeyreklik</SelectItem>
                <SelectItem value="year">Yıllık</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor Al
            </Button>
            <Button variant="outline" size="sm" disabled={refreshing} onClick={handleRefreshData}>
              {refreshing ? (
                <>
                  <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Yenile
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Departman seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  <SelectItem value="sales">Satış</SelectItem>
                  <SelectItem value="marketing">Pazarlama</SelectItem>
                  <SelectItem value="operations">Operasyon</SelectItem>
                  <SelectItem value="hr">İnsan Kaynakları</SelectItem>
                  <SelectItem value="finance">Finans</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <Card key={kpi.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{kpi.name}</h3>
                  </div>
                  <Badge className={getStatusColor(kpi.status)}>{getStatusText(kpi.status)}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{kpi.current}</span>
                    <span className="text-sm text-gray-600">
                      / {kpi.target}
                      {kpi.unit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        kpi.current >= kpi.target
                          ? "bg-green-500"
                          : kpi.current >= kpi.target * 0.8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Bu ay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Departman Performansı
              </CardTitle>
              <CardDescription>Departman bazlı hedef gerçekleşme oranları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <button onClick={() => handleDepartmentClick(dept.name)} className="w-full text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{dept.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {dept.employees} kişi
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {dept.score}% / {dept.target}%
                          </span>
                          {dept.score >= dept.target ? (
                            <Award className="w-4 h-4 text-green-600" />
                          ) : (
                            <Target className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${dept.score >= dept.target ? "bg-green-500" : "bg-yellow-500"}`}
                          style={{ width: `${Math.min((dept.score / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Performans Trendleri
              </CardTitle>
              <CardDescription>Son 6 aylık performans analizi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">78%</div>
                    <div className="text-sm text-green-700">Hedeflere Ulaşan</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">+12%</div>
                    <div className="text-sm text-blue-700">Genel İyileşme</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mükemmel Performans</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">İyi Performans</span>
                    <span className="text-sm font-medium">33%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gelişim Gerekli</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Önerilen Aksiyonlar</CardTitle>
            <CardDescription>Performansı artırmak için önerilen iyileştirme adımları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Çalışan Devir Hızını Azaltın</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Çalışan devir hızı hedefin üzerinde. İnsan Kaynakları ile görüşerek çalışan memnuniyeti anketleri
                    düzenleyin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Müşteri Memnuniyetini Artırın</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Müşteri memnuniyeti hedefin altında. Müşteri geri bildirim sistemini güçlendirin ve hizmet kalitesi
                    eğitimleri düzenleyin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Operasyonel Verimliliği Optimize Edin</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Süreç otomasyonu ve dijitalleşme projelerine odaklanarak operasyonel verimliliği artırın.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
