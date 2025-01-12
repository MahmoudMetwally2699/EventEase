import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';  // Changed to named import
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const safeEvents = events.map(event => ({
      ...event,
      organizerId: event.organizerId || 'default_user_id', // Provide default value if null
      attendees: event.attendees || [],
      organizer: {
        id: event.creator.id,
        name: event.creator.name || '',
        email: event.creator.email
      }
    }));

    return NextResponse.json(safeEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, date, location, maxAttendees } = await request.json();

    if (!name || !date || !location || !maxAttendees) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        maxAttendees: parseInt(maxAttendees),
        organizerId: session.user.id,
        attendees: {
          create: [
            {
              userId: session.user.id,
            },
          ],
        },
      },
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
    });

    const transformedEvent = {
      ...event,
      organizer: event.creator,
    };

    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Error creating event" },
      { status: 500 }
    );
  }
}
