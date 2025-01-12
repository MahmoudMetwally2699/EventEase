'use client'

import { useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import SearchFilters from '@/components/SearchFilters'
import { Event } from '@/types'

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]) // Make sure it's initialized as an empty array
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array and has the expected structure
        if (Array.isArray(data)) {
          setEvents(data.map(event => ({
            ...event,
            date: new Date(event.date).toISOString(), // Ensure date is properly formatted
            attendees: Array.isArray(event.attendees) ? event.attendees : []
          })));
        } else {
          console.error('Invalid data format received:', data);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [])

  const filteredEvents = Array.isArray(events)
    ? events
        .filter((event) =>
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name)
            case 'capacity':
              return (b.attendees.length / b.maxAttendees) - (a.attendees.length / a.maxAttendees)
            default:
              return new Date(a.date).getTime() - new Date(b.date).getTime()
          }
        })
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upcoming Events
            </h1>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <SearchFilters
              search={search}
              onSearchChange={(e) => setSearch(e.target.value)}
              sortBy={sortBy}
              onSortChange={(e) => setSortBy(e.target.value)}
            />
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-xl bg-gray-100 animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No events found matching your criteria</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="transform transition-all hover:scale-[1.02]">
                    <EventCard event={event} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
