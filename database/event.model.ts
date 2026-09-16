import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const requiredNonEmptyString = {
  type: String,
  trim: true,
  validate: {
    validator: (value: string): boolean => value.trim().length > 0,
    message: "This field cannot be empty.",
  },
};

const requiredNonEmptyArray = {
  type: [String],
  validate: {
    validator: (value: string[]): boolean =>
      Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
    message: "This field must contain at least one non-empty value.",
  },
};

export const EventSchema = new Schema<IEvent>(
  {
    title: {
      ...requiredNonEmptyString,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      ...requiredNonEmptyString,
      required: true,
    },
    overview: {
      ...requiredNonEmptyString,
      required: true,
    },
    image: {
      ...requiredNonEmptyString,
      required: true,
    },
    venue: {
      ...requiredNonEmptyString,
      required: true,
    },
    location: {
      ...requiredNonEmptyString,
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => !Number.isNaN(Date.parse(value)),
        message: "Event date must be a valid ISO date string.",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(value.trim()),
        message: "Event time must follow a consistent format such as 9:00 AM.",
      },
    },
    mode: {
      ...requiredNonEmptyString,
      required: true,
    },
    audience: {
      ...requiredNonEmptyString,
      required: true,
    },
    agenda: {
      ...requiredNonEmptyArray,
      required: true,
    },
    organizer: {
      ...requiredNonEmptyString,
      required: true,
    },
    tags: {
      ...requiredNonEmptyArray,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a URL-friendly slug from the title only when the title changes.
EventSchema.pre<IEvent>("save", function () {
  const rawTitle = this.title?.trim();

  if (!rawTitle) {
    throw new Error("Event title is required.");
  }

  if (this.isModified("title")) {
    this.slug = rawTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Normalize the date to a stable ISO date string.
  const normalizedDate = new Date(this.date);
  if (Number.isNaN(normalizedDate.getTime())) {
    throw new Error("Event date is invalid.");
  }
  this.date = normalizedDate.toISOString().split("T")[0];

  // Keep the time in a standard format for consistent storage and display.
  const timeValue = this.time.trim();
  const match = timeValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) {
    throw new Error("Event time must be in a valid format such as 9:00 AM.");
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const period = (match[3] || "AM").toUpperCase();
  const normalizedHour = hours % 12 || 12;

  this.time = `${normalizedHour}:${minutes} ${period}`;
});

export const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", EventSchema);

export default Event;
