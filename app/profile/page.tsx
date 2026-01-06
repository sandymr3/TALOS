"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, type User as FirebaseUser } from "firebase/auth";
import PageSection from "@/components/_core/layout/PageSection";
import { api, type User, type EventRegistration, type WorkshopRegistration } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const { user: firebaseUser, loading: authLoading } = useAuth() as { user: FirebaseUser | null; loading: boolean };

  const [profile, setProfile] = useState<User | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState<WorkshopRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [profileData, eventsData, workshopsData] = await Promise.all([
          api.getUserProfile(),
          api.getUserEvents(),
          api.getUserWorkshops(),
        ]);
        setProfile(profileData);
        setEventRegistrations(eventsData);
        setWorkshopRegistrations(workshopsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && firebaseUser) {
      fetchUserData();
    }
  }, [firebaseUser, authLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (authLoading || loading) {
    return (
      <PageSection title="Profile" className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection title="Profile" className="min-h-screen">
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
    <PageSection title="Profile" className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-muted/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            {(profile?.profile_photo || (firebaseUser && firebaseUser.photoURL)) ? (
              <img
                src={profile?.profile_photo || (firebaseUser?.photoURL ?? "")}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-red-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center border-2 border-red-600">
                <span className="text-2xl font-bold text-red-600">
                  {(profile?.name || (firebaseUser?.displayName ?? "U"))[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {profile?.name || (firebaseUser?.displayName ?? "User")}
              </h2>
              <p className="text-gray-400">{profile?.email || (firebaseUser?.email ?? "")}</p>
              {profile?.college && <p className="text-gray-500 text-sm">{profile.college}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors border border-red-600/50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Event Registrations */}
        <div className="bg-muted/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-red-600 mb-4 zen-dots-regular">
            Event Registrations
          </h3>
          {eventRegistrations.length === 0 ? (
            <p className="text-gray-400">No event registrations yet.</p>
          ) : (
            <div className="space-y-4">
              {eventRegistrations.map((reg) => (
                <div
                  key={reg.registration_id}
                  className="bg-black/30 rounded-lg p-4 border border-white/5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-bold">{reg.event_name || reg.event_id}</p>
                      <p className="text-gray-400 text-sm">Team: {reg.team_name}</p>
                      <p className="text-gray-400 text-sm">Leader: {reg.leader_name}</p>
                      {reg.members && reg.members.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                          Members: {reg.members.map((m: any) => m.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.status === "confirmed"
                          ? "bg-green-600/20 text-green-500"
                          : "bg-yellow-600/20 text-yellow-500"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Registered: {new Date(reg.registered_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workshop Registrations */}
        <div className="bg-muted/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-red-600 mb-4 zen-dots-regular">
            Workshop Registrations
          </h3>
          {workshopRegistrations.length === 0 ? (
            <p className="text-gray-400">No workshop registrations yet.</p>
          ) : (
            <div className="space-y-4">
              {workshopRegistrations.map((reg) => (
                <div
                  key={reg.registration_id}
                  className="bg-black/30 rounded-lg p-4 border border-white/5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-bold">{reg.workshop_name || reg.workshop_id}</p>
                      <p className="text-gray-400 text-sm">Participant: {reg.name}</p>
                      <p className="text-gray-400 text-sm">Amount: ₹{reg.amount}</p>
                      <p className="text-gray-400 text-sm">
                        Payment: {reg.payment_status}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.status === "confirmed"
                          ? "bg-green-600/20 text-green-500"
                          : "bg-yellow-600/20 text-yellow-500"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Registered: {new Date(reg.registered_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageSection>
  );
}
