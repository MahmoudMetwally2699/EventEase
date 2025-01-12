import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    const eventId = resolvedParams.id

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is full
    if (event.attendees.length >= event.maxAttendees) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 })
    }

    // Check if user is already registered
    const existingRegistration = await prisma.attendee.findFirst({
      where: {
        eventId: eventId,
        userId: session.user.id,
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Create registration
    const registration = await prisma.attendee.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: true,
      },
    })

    return NextResponse.json({
      message: 'Registration successful',
      registration,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}
