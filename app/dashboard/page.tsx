'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import PageSection from '@/components/_core/layout/PageSection';
import Image from 'next/image';

interface Registration {
  id: string;
  eventName: string;
  eventSlug: string;
  registrationDate: any;
  paymentStatus: 'pending' | 'completed' | 'not_required';
  paymentAmount: number;
  teamName?: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user || !db) return;

      try {
        setLoadingRegistrations(true);
        const allRegistrations: Registration[] = [];

        // Get all collections that end with '_registrations'
        // Ideally, fetch events list first or have a central registrations collection
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        
        for (const eventDoc of eventsSnapshot.docs) {
          const eventSlug = eventDoc.id;
          const eventData = eventDoc.data();
          const registrationsRef = collection(db, `${eventSlug}_registrations`);
          const q = query(registrationsRef, where('userEmail', '==', user.email));
          const registrationsSnapshot = await getDocs(q);

          registrationsSnapshot.forEach((doc) => {
            const data = doc.data();
            allRegistrations.push({
              id: doc.id,
              eventName: eventData.title || eventSlug,
              eventSlug: eventSlug,
              registrationDate: data.registrationDate,
              paymentStatus: data.paymentStatus || 'pending',
              paymentAmount: data.paymentAmount || 0,
              teamName: data.teamName,
            });
          });
        }

        setRegistrations(allRegistrations);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoadingRegistrations(false);
      }
    };

    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  if (loading) {
    return (
      <PageSection title="Loading" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </PageSection>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <PageSection title="Dashboard" className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-red-600 shadow-lg shadow-red-600/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-red-700">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{user.displayName || 'User'}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="mt-3 flex gap-3">
                <div className="inline-block px-3 py-1 bg-red-600/20 border border-red-600/50 rounded-full text-red-400 text-xs font-semibold">
                  Verified Account
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-gray-300 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">My Registrations</h3>
            <button
              onClick={() => router.push('/events')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-red-600/30"
            >
              Browse Events
            </button>
          </div>

          {loadingRegistrations ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-xl font-semibold text-white mb-2">No registrations yet</h4>
              <p className="text-gray-400 mb-6">Start exploring events and register to participate!</p>
              <button
                onClick={() => router.push('/events')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold shadow-lg shadow-red-600/30"
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-gradient-to-r from-red-950/20 to-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-all shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{registration.eventName}</h4>
                      {registration.teamName && (
                        <p className="text-sm text-gray-400 mb-2">
                          Team: <span className="text-red-400 font-semibold">{registration.teamName}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Registered on:{' '}
                        {registration.registrationDate?.toDate
                          ? new Date(registration.registrationDate.toDate()).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        {registration.paymentStatus === 'completed' && (
                          <span className="inline-block px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-green-400 text-xs font-semibold">
                            ✓ Payment Completed
                          </span>
                        )}
                        {registration.paymentStatus === 'pending' && (
                          <span className="inline-block px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 rounded-full text-yellow-400 text-xs font-semibold">
                            ⏱ Payment Pending
                          </span>
                        )}
                        {registration.paymentStatus === 'not_required' && (
                          <span className="inline-block px-3 py-1 bg-blue-600/20 border border-blue-600/50 rounded-full text-blue-400 text-xs font-semibold">
                            Free Event
                          </span>
                        )}
                      </div>
                      {registration.paymentAmount > 0 && (
                        <p className="text-lg font-bold text-red-400">₹{registration.paymentAmount}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                    <button
                      onClick={() => router.push(`/events/${registration.eventSlug}`)}
                      className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg transition-colors text-sm font-semibold"
                    >
                      View Event
                    </button>
                    {registration.paymentStatus === 'pending' && (
                      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-red-600/30">
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageSection>
  );
}
