'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function Profile() {
  const { data: session } = useSession()
  const router = useRouter()
  const [createdEvents, setCreatedEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<'created' | 'registered'>('created')

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    const fetchUserEvents = async () => {
      const [createdRes, registeredRes] = await Promise.all([
        fetch('/api/user/events/created'),
        fetch('/api/user/events/registered'),
      ])
      const [created, registered] = await Promise.all([
        createdRes.json(),
        registeredRes.json(),
      ])
      setCreatedEvents(created)
      setRegisteredEvents(registered)
    }

    fetchUserEvents()
  }, [session, router])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="flex gap-4 border-b">
        <Button
          variant={activeTab === 'created' ? 'default' : 'outline'}
          onClick={() => setActiveTab('created')}
        >
          Created Events ({createdEvents.length})
        </Button>
        <Button
          variant={activeTab === 'registered' ? 'default' : 'outline'}
          onClick={() => setActiveTab('registered')}
        >
          Registered Events ({registeredEvents.length})
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'created' ? createdEvents : registeredEvents).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
