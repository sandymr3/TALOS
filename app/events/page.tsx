"use client";

import { useEffect, useState } from "react";
import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { FlipCard } from "@/components/ui/FlipCard";
import { api, type Event } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <PageSection title="Events" className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection title="Events" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Events" className="min-h-screen">
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <FlipCard
              key={event.event_id}
              backContent={
                <div className="flex min-h-full flex-col gap-2">
                  <h1 className="text-3xl font-bold text-red-600 zen-dots-regular">{event.title}</h1>
                  <p className="mt-1 border-t border-t-gray-200/20 py-4 text-base leading-normal ibm-plex-mono-semibold text-gray-300">
                    {event.description}
                  </p>
                  <div className="mt-auto flex flex-col gap-4">
                    <span className="w-fit text-xs font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
                      {event.date}, {event.time}
                    </span>
                    {event.registration_fee > 0 && (
                      <span className="w-fit text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">
                        ₹{event.registration_fee}
                      </span>
                    )}
                    <Link 
                      href={`/events/${event.event_id}`} 
                      className="w-full text-center px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors zen-dots-regular text-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              }
            >
              <div className="relative h-full w-full">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="size-full rounded-2xl object-cover shadow-2xl shadow-black/40"
                />
                <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                <div className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-md zen-dots-regular">
                  {event.title}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded border border-white/10">
                    {event.category}
                  </span>
                </div>
                {event.is_team_event && (
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold bg-red-600/80 backdrop-blur-md text-white px-2 py-1 rounded">
                      Team Event
                    </span>
                  </div>
                )}
              </div>
            </FlipCard>
          ))}
        </div>
      )}
    </PageSection>
  );
}
