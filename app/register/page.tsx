'use client';
import PageSection from '@/components/_core/layout/PageSection';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to events page
    router.push('/events');
  }, [router]);

  return (
    <PageSection title="Register" className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-12 shadow-2xl">
          <svg
            className="mx-auto h-20 w-20 text-red-600 mb-6"
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
          <h2 className="text-3xl font-bold text-white mb-4">Select an Event to Register</h2>
          <p className="text-gray-400 mb-8">
            Browse through our exciting events and register for the ones that interest you.
          </p>
          <button
            onClick={() => router.push('/events')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70"
          >
            Browse Events
          </button>
        </div>
      </div>
    </PageSection>
  );
}
