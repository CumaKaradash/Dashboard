"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { DatabaseOperations, type Notification } from "@/lib/database"
import { cn } from "@/lib/utils"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const allNotifications = DatabaseOperations.notifications.getAll()
    const unread = DatabaseOperations.notifications.getUnread()
    setNotifications(allNotifications)
    setUnreadCount(unread.length)
  }

  const markAsRead = (id: string) => {
    DatabaseOperations.notifications.markAsRead(id)
    loadNotifications()
  }

  const markAllAsRead = () => {
    DatabaseOperations.notifications.markAllAsRead()
    loadNotifications()
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Şimdi"
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`
    return `${Math.floor(diffInMinutes / 1440)} gün önce`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-4 top-16 w-96 max-h-[80vh] bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle className="text-lg">Bildirimler</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Tümünü Okundu İşaretle
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.read && "bg-blue-50 border-l-4 border-l-blue-500",
                    )}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hook for notification management
export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const unread = DatabaseOperations.notifications.getUnread()
      setUnreadCount(unread.length)
    }

    updateCount()

    // Check for new notifications every 30 seconds
    const interval = setInterval(updateCount, 30000)

    return () => clearInterval(interval)
  }, [])

  const createNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    DatabaseOperations.notifications.create(notification)
    setUnreadCount((prev) => prev + 1)
  }

  return {
    unreadCount,
    createNotification,
  }
}
