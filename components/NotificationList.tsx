'use client'

import { Toast } from './ui/Toast'
import { useNotificationContext } from '@/providers/NotificationProvider'

export function NotificationList() {
  const { notifications, removeNotification } = useNotificationContext()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
