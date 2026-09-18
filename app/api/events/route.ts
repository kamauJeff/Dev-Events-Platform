import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

const parseStringArray = (value: FormDataEntryValue | null): string[] => {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    // Accept plain text when the multipart client does not send JSON.
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const contentType = request.headers.get("content-type") ?? "";
    let event: Record<string, unknown>;

    if (contentType.includes("application/json")) {
      event = (await request.json()) as Record<string, unknown>;
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      event = Object.fromEntries(formData.entries()) as Record<string, unknown>;

      const file = formData.get("image") as File | null;

      if (!file) {
        return NextResponse.json(
          { message: "Image file is required." },
          { status: 400 }
        );
      }

      event.tags = parseStringArray(formData.get("tags"));
      event.agenda = parseStringArray(formData.get("agenda"));

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", folder: "DevEvent" }, (error, results) => {
            if (error) {
              return reject(error);
            }

            resolve(results);
          })
          .end(buffer);
      });

      event.image = (uploadResult as { secure_url: string }).secure_url;
    } else {
      return NextResponse.json(
        { message: "Unsupported content type. Send JSON or form data." },
        { status: 415 }
      );
    }

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { message: "An event with this title or slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}