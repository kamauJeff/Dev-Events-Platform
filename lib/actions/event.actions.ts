import Event from '@/database/event.model'

import { connectToDatabase } from "../mongodb";

export const getEvents = async () => {
    await connectToDatabase();
    return Event.find().sort({ createdAt: -1 }).lean().exec();
};

export const getEventBySlug = async (slug: string) => {
    await connectToDatabase();
    return Event.findOne({ slug }).lean().exec();
};

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({slug});

        if (!event) {
            return [];
        }

        return await Event.find({
            _id: {$ne: event._id},
            tags: {$in: event.tags},
        }).lean();
    } catch {
        return [];
    }
}