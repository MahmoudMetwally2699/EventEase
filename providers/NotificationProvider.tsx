'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Toast } from '@/components/ui/Toast'
import { useNotification } from '@/hooks/useNotification'

interface NotificationContextType {
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
  notifications: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
  }>
}

const NotificationContext = createContext<NotificationContextType>({
  addNotification: () => {},
  removeNotification: () => {},
  notifications: [],
})

export const useNotificationContext = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, addNotification, removeNotification } = useNotification()

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}
