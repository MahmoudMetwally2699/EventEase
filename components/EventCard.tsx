'use client'

import { Event } from '@/types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const { data: session, status } = useSession()

  // Only show edit button if user is logged in AND is the organizer
  const isOrganizer = session?.user?.id === event.organizerId

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6">
      <Link
        href={`/events/${event.id}`}
        className="block rounded-lg border p-6 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-bold">{event.name}</h2>
        <p className="text-gray-600 mt-2">
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">{event.location}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {event.attendees.length} / {event.maxAttendees} attendees
          </span>
          {event.attendees.length >= event.maxAttendees && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              Full
            </span>
          )}
        </div>
      </Link>

      {/* Only show edit button if user is logged in AND is the organizer */}
      {status === 'authenticated' && isOrganizer && (
        <div className="mt-4 flex justify-end">
          <Link
            href={`/events/${event.id}/edit`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Event
          </Link>
        </div>
      )}
    </div>
  )
}
