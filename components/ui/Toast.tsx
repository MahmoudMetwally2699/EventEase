'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'min-w-[200px] p-4 rounded-lg shadow-lg text-white transition-all duration-300',
        {
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
          'opacity-100 translate-y-0': isVisible,
          'opacity-0 translate-y-2': !isVisible,
        }
      )}
      role="alert"
    >
      {message}
    </div>
  )
}
