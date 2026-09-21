'use client';

import React, { useState } from 'react';
import { createBooking } from '@/lib/actions/booking.action';
import { posthog } from 'posthog-js';
import Link from 'next/link';

const BookEvent = ({ eventId, slug, isAuthenticated }: { eventId: string, slug: string, isAuthenticated: boolean }) => {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await createBooking({ eventId });
        setIsSubmitting(false);

        if (result.success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug });
        } else {
            const message = result.error ?? 'Booking creation failed.';
            setError(message);
            console.error('Booking creation failed', message);
        }

    }

  return (
    <div id= "book-event">
        {!isAuthenticated ? (
            <>
                <p className="text-sm">Sign in before booking your spot.</p>
                <Link href="/auth/login" className="button-submit">Log in to book</Link>
            </>
        ) : submitted ? (
            <p className="text-sm">Thank you for signing up!</p>
        ):(
            <form onSubmit={handleSubmit}>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <button type="submit"
                className="button-submit"
                disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        )}
      
    </div>
  )
}

export default BookEvent
