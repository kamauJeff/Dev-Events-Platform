import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event, { type IEvent } from "@/database/event.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { message: "Event slug is required." },
        { status: 400 }
      );
    }

    const normalizedSlug = slug.trim();

    const event: IEvent | null = await Event.findOne({ slug: normalizedSlug }).lean<IEvent>().exec();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${normalizedSlug}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch event by slug:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch event.",
        error: error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 500 }
    );
  }
}
