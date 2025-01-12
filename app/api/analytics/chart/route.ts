import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get events for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const events = await prisma.event.findMany({
      where: {
        organizerId: session.user.id,
        date: {
          gte: sixMonthsAgo
        }
      },
      include: {
        attendees: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Group events by month
    const monthlyData = events.reduce((acc, event) => {
      const month = new Date(event.date).toLocaleString('default', { month: 'short' })
      if (!acc[month]) {
        acc[month] = {
          events: 0,
          attendees: 0
        }
      }
      acc[month].events++
      acc[month].attendees += event.attendees.length
      return acc
    }, {} as Record<string, { events: number; attendees: number }>)

    // Transform data for chart
    const chartData = {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: 'Events',
          data: Object.values(monthlyData).map(d => d.events)
        },
        {
          label: 'Attendees',
          data: Object.values(monthlyData).map(d => d.attendees)
        }
      ]
    }

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Chart data error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
