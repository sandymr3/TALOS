'use client';

import PageSection from '@/components/_core/layout/PageSection';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, type Event, type TeamMember } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const eventId = searchParams.get('event');
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  
  const [registrationType, setRegistrationType] = useState<'solo' | 'team'>('solo');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', email: '', phone: '' }]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchEvent = async () => {
      if (!eventId) {
        setError('No event specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.getEvent(eventId);
        setEvent(data);
        setRegistrationType(data.is_team_event ? 'team' : 'solo');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchEvent();
    }
  }, [eventId, user, authLoading, router]);

  const addTeamMember = () => {
    if (event?.max_team_size && teamMembers.length >= event.max_team_size - 1) {
      alert(`Maximum team size is ${event.max_team_size} (including you)`);
      return;
    }
    setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !eventId) return;

    // Validate team registration
    if (registrationType === 'team') {
      if (!teamName.trim()) {
        alert('Please enter a team name');
        return;
      }
      const validMembers = teamMembers.filter(m => m.name.trim() && m.email.trim());
      if (validMembers.length === 0) {
        alert('Please add at least one team member');
        return;
      }
    }

    try {
      setRegistering(true);
      await api.registerForEvent(eventId, {
        registration_type: registrationType,
        team_name: registrationType === 'team' ? teamName : undefined,
        team_members: registrationType === 'team' 
          ? teamMembers.filter(m => m.name.trim() && m.email.trim())
          : undefined,
      });
      alert('Registration successful!');
      router.push('/profile');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PageSection title="Register" className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (error || !event) {
    return (
      <PageSection title="Register" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">{error || 'Event not found'}</p>
          <button
            onClick={() => router.push('/events')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Register" className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-6 bg-muted/20 shadow-lg rounded-xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-primary">{event.title}</h3>
          <p className="mb-4 text-muted-foreground">{event.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>{event.date}, {event.time}</span>
            {event.venue && <span>• {event.venue}</span>}
            {event.registration_fee > 0 && (
              <span className="text-green-500">• ₹{event.registration_fee}</span>
            )}
          </div>
        </div>

        <div className="bg-muted/20 shadow-lg rounded-xl p-8 border border-white/10 backdrop-blur-sm">
          {event.is_team_event && (
            <div className="flex gap-4 mb-8">
              <button 
                type="button"
                className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium ${
                  registrationType === 'solo' 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-black/40 text-gray-400 hover:bg-black/60'
                }`}
                onClick={() => setRegistrationType('solo')}
              >
                Solo Registration
              </button>
              <button 
                type="button"
                className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium ${
                  registrationType === 'team' 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-black/40 text-gray-400 hover:bg-black/60'
                }`}
                onClick={() => setRegistrationType('team')}
              >
                Team Registration
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
              <p className="text-sm text-gray-400">
                Registering as: <span className="text-white font-bold">{user?.displayName || user?.email}</span>
              </p>
            </div>
            
            {registrationType === 'team' && (
              <>
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Team Name</label>
                  <input 
                    type="text" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors" 
                    placeholder="The Avengers" 
                    required
                  />
                </div>
                
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 delay-75">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Team Members {event.max_team_size && `(Max: ${event.max_team_size - 1} additional members)`}
                  </label>
                  
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="p-4 bg-black/20 border border-white/5 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Member {index + 1}</span>
                          {teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-500 text-sm hover:text-red-400"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm" 
                          placeholder="Member Name" 
                          required
                        />
                        <input 
                          type="email" 
                          value={member.email}
                          onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm" 
                          placeholder="member@email.com" 
                          required
                        />
                        <input 
                          type="tel" 
                          value={member.phone || ''}
                          onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm" 
                          placeholder="Phone (optional)" 
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="mt-4 w-full p-3 bg-black/20 border border-white/10 border-dashed rounded-lg text-sm text-gray-400 hover:text-white hover:border-primary transition-colors"
                  >
                    + Add Member
                  </button>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={registering}
              className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registering ? 'Registering...' : event.registration_fee > 0 ? `Proceed to Payment (₹${event.registration_fee})` : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </PageSection>
  );
}
