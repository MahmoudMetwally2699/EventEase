'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useNotificationContext } from '@/providers/NotificationProvider'

export default function EditEvent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { addNotification } = useNotificationContext()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    maxAttendees: '',
    organizerId: '', // Add this to check ownership
  })

  useEffect(() => {
    const checkPermissionAndFetchEvent = async () => {
      if (!session?.user) {
        router.push('/auth/signin')
        return
      }

      try {
        const response = await fetch(`/api/events/${params.id}`)
        const event = await response.json()

        // Immediately redirect if not the organizer
        if (event.organizerId !== session.user.id) {
          addNotification('You do not have permission to edit this event', 'error')
          router.push(`/events/${params.id}`)
          return
        }

        setFormData({
          name: event.name,
          date: new Date(event.date).toISOString().slice(0, 16),
          location: event.location,
          maxAttendees: String(event.maxAttendees),
          organizerId: event.organizerId,
        })
      } catch (error) {
        addNotification(error instanceof Error ? error.message : 'Failed to fetch event details', 'error')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissionAndFetchEvent()
  }, [session, params.id, router, addNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update event')
      }

      addNotification('Event updated successfully', 'success')
      router.push(`/events/${params.id}`)
    } catch (error) {
      addNotification(error instanceof Error ? error.message : 'Failed to update event', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all hover:scale-[1.01]">
          <div>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Event
            </h1>
            <p className="text-center text-gray-500 mt-2">Update your event details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Event Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Input
              label="Date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Input
              label="Maximum Attendees"
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              required
              className="focus:ring-2 focus:ring-purple-500 transition-all"
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transform transition-all hover:scale-[1.02] focus:ring-2 focus:ring-purple-500"
              >
                Update Event
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-purple-500 transform transition-all hover:scale-[1.02] focus:ring-2 focus:ring-purple-500"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
