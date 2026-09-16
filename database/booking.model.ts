import mongoose, { Schema, type Model, type Document } from "mongoose";
import { Event } from "./event.model";

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Please provide a valid email address.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure the booking references a real event before it can be saved.
BookingSchema.pre<IBooking>("save", async function () {
  if (!this.eventId) {
    throw new Error("Booking must reference a valid event.");
  }

  const existingEvent = await Event.exists({ _id: this.eventId });

  if (!existingEvent) {
    throw new Error("The referenced event does not exist.");
  }
});

export const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
