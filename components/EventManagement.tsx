'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import Input from './ui/Input'
import { Event } from '@/types'
import { useNotificationContext } from '@/providers/NotificationProvider'

interface EventManagementProps {
  event: Event
  isCreator: boolean
}

export default function EventManagement({ event, isCreator }: EventManagementProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: event.name,
    date: event.date,
    location: event.location,
    maxAttendees: event.maxAttendees,
  })
  const router = useRouter()
  const { addNotification } = useNotificationContext()

  if (!isCreator) return null

  const handleUpdate = async () => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      addNotification('Event updated successfully', 'success')
      setIsEditing(false)
      router.refresh()
    } else {
      addNotification('Failed to update event', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return

    const response = await fetch(`/api/events/${event.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      addNotification('Event deleted successfully', 'success')
      router.push('/')
    } else {
      addNotification('Failed to delete event', 'error')
    }
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Event Management</h2>
      {isEditing ? (
        <div className="space-y-4">
          <Input
            label="Event Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input
            label="Maximum Attendees"
            type="number"
            value={formData.maxAttendees}
            onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
          />
          <div className="flex gap-2">
            <Button onClick={handleUpdate}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)}>Edit Event</Button>
          <Button variant="outline" onClick={handleDelete}>
            Delete Event
          </Button>
        </div>
      )}
    </div>
  )
}
