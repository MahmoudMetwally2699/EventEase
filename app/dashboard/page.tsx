'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnalyticsCard from '@/components/AnalyticsCard'
import EventsChart from '@/components/EventsChart'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    registrationRate: 0,
  })

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    const fetchAnalytics = async () => {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      setAnalytics(data)
    }

    fetchAnalytics()
  }, [session, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total Events"
              value={analytics.totalEvents}
              icon="📅"
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] p-6"
            />
            <AnalyticsCard
              title="Total Attendees"
              value={analytics.totalAttendees}
              icon="👥"
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] p-6"
            />
            <AnalyticsCard
              title="Upcoming Events"
              value={analytics.upcomingEvents}
              icon="🎯"
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] p-6"
            />
            <AnalyticsCard
              title="Registration Rate"
              value={`${analytics.registrationRate}%`}
              icon="📈"
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] p-6"
            />
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Event Analytics</h2>
            <div className="h-[400px]">
              <EventsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
