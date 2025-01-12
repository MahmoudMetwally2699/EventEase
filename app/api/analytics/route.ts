import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's events
    const events = await prisma.event.findMany({
      where: {
        organizerId: session.user.id
      },
      include: {
        attendees: true
      }
    })

    // Calculate analytics
    const totalEvents = events.length
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0)
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length
    const registrationRate = totalEvents > 0
      ? Math.round((totalAttendees / (totalEvents * events.reduce((sum, event) => sum + event.maxAttendees, 0))) * 100)
      : 0

    return NextResponse.json({
      totalEvents,
      totalAttendees,
      upcomingEvents,
      registrationRate
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
