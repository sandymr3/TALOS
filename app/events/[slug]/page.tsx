"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { api, type Event } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() as { user: FirebaseUser | null; loading: boolean };
  const eventId = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await api.getEvent(eventId);
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!event) return;

    // All events are team-based, redirect to registration page
    router.push(`/register/${eventId}`);
  };

  if (loading) {
    return (
      <PageSection title="Event Details" className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (error || !event) {
    return (
      <PageSection title="Event Details" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">{error || "Event not found"}</p>
          <Link
            href="/events"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Event Details" className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CardContainer className="w-full py-10">
          <CardBody className="w-full h-auto">
            <CardItem translateZ="100" className="w-full">
              <div 
                className="h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(127, 29, 29, 0.9), rgba(0, 0, 0, 0.9)), url(${event.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div>
                  <span className="text-xs font-bold bg-red-600/80 text-white px-2 py-1 rounded mb-2 inline-block">
                    {event.category}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                    {event.title}
                  </h1>
                </div>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold">
                {event.description}
              </p>
            </div>

            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Team Information
              </h3>
              <p className="text-gray-400 font-ibm-plex-mono font-bold text-lg">
                This is a team event. Team size: {event.min_team_size} - {event.max_team_size} members (including leader).
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h4 className="text-xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Event Info
              </h4>
              <div className="space-y-4 text-base font-bold font-ibm-plex-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{event.time}</span>
                </div>
                {event.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue</span>
                    <span className="text-white">{event.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="text-green-400">Free</span>
                </div>
                {event.max_participants && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity</span>
                    <span className="text-white">{event.max_participants}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || event.status !== "open"}
                className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering
                  ? "Registering..."
                  : event.status !== "open"
                  ? "Registration Closed"
                  : user
                  ? "Register Now"
                  : "Login to Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
