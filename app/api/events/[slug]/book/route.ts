import { Booking } from "@/database/booking.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const body = await req.json();
    const { email } = body || {};

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "A valid email is required" },
        { status: 400 },
      );
    }

    // Find event by slug to get its _id
    const Event = (await import("@/database/event.model")).Event;
    const event = await Event.findOne({ slug }).lean();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Create booking
    const booking = new Booking({ eventId: event._id, email });
    await booking.save();

    return NextResponse.json(
      { message: "Booked", bookingId: booking._id },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Failed to create booking",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
