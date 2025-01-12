import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await the params if it's a Promise
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await the params if it's a Promise
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.organizerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name: body.name,
        date: new Date(body.date),
        location: body.location,
        maxAttendees: parseInt(body.maxAttendees),
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
