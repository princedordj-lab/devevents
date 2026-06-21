import { Event } from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()

        const formData = await req.formData();

        // Extract the image file
        const file = formData.get('image') as File | null;
        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
        }

        // Upload image to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'events' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result!);
                }
            );
            uploadStream.end(buffer);
        });


        // Build event data from text fields only (skip the image file)
        const eventData: Record<string, unknown> = {};
        for (const [key, value] of formData.entries()) {
            if (key === 'image') continue;

            // Parse array fields (agenda, tags) from JSON or comma-separated string
            if ((key === 'agenda' || key === 'tags') && typeof value === 'string') {
                try {
                    eventData[key] = JSON.parse(value);
                } catch {
                    eventData[key] = (value as string).split(',').map(s => s.trim()).filter(Boolean);
                }
            } else {
                eventData[key] = value;
            }
        }

        // Set the Cloudinary URL as the event image
        eventData.image = uploadResult.secure_url;

        const createdEvent = await Event.create(eventData);
        return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 });

    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 400 })
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase()
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ events }, { status: 200 });
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: 'Failed to fetch events', error: e instanceof Error ? e.message : 'Unknown' }, { status: 400 })
    }
}