"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
}

interface ToastNotificationsProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastNotifications({ toasts, onRemove }: ToastNotificationsProps) {
  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getVariant = (type: Toast["type"]) => {
    return type === "error" ? "destructive" : "default"
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={getVariant(toast.type)}
          className={cn(
            "w-96 shadow-lg border",
            toast.type === "success" && "border-green-200 bg-green-50",
            toast.type === "warning" && "border-yellow-200 bg-yellow-50",
            toast.type === "info" && "border-blue-200 bg-blue-50",
          )}
        >
          <div className="flex items-start gap-3">
            {getIcon(toast.type)}
            <div className="flex-1">
              <h4 className="font-medium">{toast.title}</h4>
              <AlertDescription className="mt-1">{toast.message}</AlertDescription>
            </div>
            <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </Alert>
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration (default 5 seconds)
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)

    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (title: string, message: string, duration?: number) => {
    return addToast({ type: "success", title, message, duration })
  }

  const error = (title: string, message: string, duration?: number) => {
    return addToast({ type: "error", title, message, duration })
  }

  const warning = (title: string, message: string, duration?: number) => {
    return addToast({ type: "warning", title, message, duration })
  }

  const info = (title: string, message: string, duration?: number) => {
    return addToast({ type: "info", title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
