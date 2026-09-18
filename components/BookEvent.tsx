'use client';

import React, { useState } from 'react';
import { createBooking } from '@/lib/actions/booking.action';
import { posthog } from 'posthog-js';

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await createBooking({ eventId, email });
        setIsSubmitting(false);

        if (result.success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            const message = result.error ?? 'Booking creation failed.';
            setError(message);
            console.error('Booking creation failed', message);
        }

    }

  return (
    <div id= "book-event">
        {submitted ? (
            <p className="text-sm">Thank you for signing up!</p>
        ):(
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email"
                    placeholder="Enter your Email Address"            
                    />
                </div>

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
