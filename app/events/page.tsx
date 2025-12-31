"use client";

import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { FlipCard } from "@/components/ui/FlipCard";

export default function EventsPage() {
  const events = [
    {
      title: "Cyber Security Hunt",
      date: "Feb 14, 10:00 AM",
      desc: "Capture the flag and secure the network.",
      category: "Technical",
      slug: "cyber-security-hunt",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Code Marathon",
      date: "Feb 14, 02:00 PM",
      desc: "24-hour non-stop coding challenge.",
      category: "Coding",
      slug: "code-marathon",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Robo Wars",
      date: "Feb 15, 09:00 AM",
      desc: "Battle of the bots. May the best bot win.",
      category: "Robotics",
      slug: "robo-wars",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Design Dash",
      date: "Feb 15, 01:00 PM",
      desc: "UI/UX challenge for creative minds.",
      category: "Design",
      slug: "design-dash",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Tech Quiz",
      date: "Feb 16, 11:00 AM",
      desc: "Test your knowledge across various tech domains.",
      category: "Quiz",
      slug: "tech-quiz",
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Project Expo",
      date: "Feb 16, 03:00 PM",
      desc: "Showcase your innovative projects.",
      category: "Expo",
      slug: "project-expo",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
    },
  ];

  return (
    <PageSection title="Events" className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <FlipCard
            key={event.slug}
            backContent={
              <div className="flex min-h-full flex-col gap-2">
                <h1 className="text-3xl font-bold text-red-600 zen-dots-regular">{event.title}</h1>
                <p className="mt-1 border-t border-t-gray-200/20 py-4 text-base leading-normal ibm-plex-mono-semibold text-gray-300">
                  {event.desc}
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <span className="w-fit text-xs font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
                    {event.date}
                  </span>
                  <Link 
                    href={`/events/${event.slug}`} 
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
                src={event.image}
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
            </div>
          </FlipCard>
        ))}
      </div>
    </PageSection>
  );
}
