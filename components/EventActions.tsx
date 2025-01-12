'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import { useNotificationContext } from '@/providers/NotificationProvider'

interface EventActionsProps {
  eventId: string
  isCreator: boolean
}

export default function EventActions({ eventId, isCreator }: EventActionsProps) {
  const router = useRouter()
  const { addNotification } = useNotificationContext()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        addNotification('Event deleted successfully', 'success')
        router.push('/')
      } else {
        throw new Error('Failed to delete event')
      }
    } catch {
      addNotification('Failed to delete event', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isCreator) return null

  return (
    <div className="flex gap-4 mt-6">
      <Button onClick={handleEdit} variant="outline">
        Edit Event
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700"
      >
        {isDeleting ? 'Deleting...' : 'Delete Event'}
      </Button>
    </div>
  )
}
