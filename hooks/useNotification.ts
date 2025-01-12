'use client'

import { useState, useCallback } from 'react'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2)
    const notification = { id, message, type }
    setNotifications(prev => [...prev, notification])

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  return { notifications, addNotification, removeNotification }
}
