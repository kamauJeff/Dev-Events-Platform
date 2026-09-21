'use server';

import { Booking } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";
import mongoose from "mongoose";
import { connectToDatabase } from "../mongodb";

export const createBooking = async ({ eventId }: { eventId: string }) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "You must be signed in to book an event." };
        }

        await connectToDatabase();
        if (!mongoose.isValidObjectId(eventId)) {
            return { success: false, error: "Invalid event." };
        }

        await Booking.create({
            eventId: new mongoose.Types.ObjectId(eventId),
            email: session.user.email,
        });

        return {success: true}

    }catch(e) {
        return {
            success: false,
            error: e instanceof Error ? e.message : "Booking creation failed.",
        };
    }
} 