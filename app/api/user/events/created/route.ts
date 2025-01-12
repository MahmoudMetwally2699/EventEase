import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: {
        creator: {
          id: session.user.id,
        },
      },
      include: {
        attendees: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching events: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
