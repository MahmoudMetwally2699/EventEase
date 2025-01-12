'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function CreateEvent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    maxAttendees: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <Input
          label="Maximum Attendees"
          type="number"
          value={formData.maxAttendees}
          onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
          required
        />
        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </div>
  )
}
