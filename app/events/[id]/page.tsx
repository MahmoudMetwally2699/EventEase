'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Event } from '@/types'
import Button from '@/components/ui/Button'
import { useNotificationContext } from '@/providers/NotificationProvider'
import { useEventSocket } from '@/hooks/useEventSocket'
import Link from 'next/link'

export default function EventDetail({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const { addNotification } = useNotificationContext()
  const [event, setEvent] = useState<Event | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()
      setEvent(data)
      setIsRegistered(data.attendees.some(
        (attendee: { userId: string }) => attendee.userId === session?.user?.id
      ))
    } catch (error) {
      console.error('Error fetching event:', error)
      addNotification('Failed to load event details', 'error')
      router.push('/')
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [params.id, session?.user?.id])

  useEventSocket(params.id, {
    onNewAttendee: (data) => {
      addNotification(`${data.attendee} has registered for this event`, 'success')
      fetchEvent()
    },
    onEventFull: () => {
      addNotification('Event is now full', 'info')
      fetchEvent()
    }
  })

  const handleRegister = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      setIsRegistered(true)
      addNotification('Successfully registered for event', 'success')
      await fetchEvent() // Refresh event data
    } catch (error: Error | unknown) {
      const message = error instanceof Error ? error.message : 'Failed to register'
      addNotification(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) {
    return <div className="text-center mt-8">Loading...</div>
  }

  const isOrganizer = session?.user?.id === event?.organizerId

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Date & Time</h2>
          <p>{new Date(event.date).toLocaleString()}</p>
        </div>

        <div>
          <h2 className="font-semibold">Location</h2>
          <p>{event.location}</p>
        </div>

        <div>
          <h2 className="font-semibold">Attendees</h2>
          <p>{event.attendees.length} / {event.maxAttendees}</p>
        </div>

        {!isRegistered && event.attendees.length < event.maxAttendees && (
          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? 'Registering...' : 'Register for Event'}
          </Button>
        )}

        {isRegistered && (
          <p className="text-green-600 mt-4">You are registered for this event</p>
        )}

        {event.attendees.length >= event.maxAttendees && !isRegistered && (
          <p className="text-red-600 mt-4">This event is full</p>
        )}

        {/* Add Edit Button for organizer */}
        {isOrganizer && (
          <div className="mt-6">
            <Link
              href={`/events/${params.id}/edit`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-[1.02]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Event
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
