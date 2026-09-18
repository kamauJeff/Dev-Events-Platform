'use server';

import { Booking } from "@/database";
import mongoose from "mongoose";
import { connectToDatabase } from "../mongodb";

export const createBooking = async ({eventId, email}: { eventId: string; email: string;}) => {
    try {
        await connectToDatabase();
        if (!mongoose.isValidObjectId(eventId)) {
            return { success: false, error: "Invalid event." };
        }

        await Booking.create({
            eventId: new mongoose.Types.ObjectId(eventId),
            email,
        });

        return {success: true}

    }catch(e) {
        return {
            success: false,
            error: e instanceof Error ? e.message : "Booking creation failed.",
        };
    }
} 