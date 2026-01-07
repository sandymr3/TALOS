'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageSection from '@/components/_core/layout/PageSection';
import { api, type Event, type EventRegistrationRequest, type TeamMember } from '@/lib/api';

export default function EventRegistrationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventSlug = params?.eventSlug as string;

  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamNameError, setTeamNameError] = useState<string | null>(null);

  // Form state - Team Leader Info
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderYear: '',
    collegeName: '',
    referralId: '',
  });

  // Team Members (1-3 members)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', email: '', phone: '' },
  ]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        const event = await api.getEvent(eventSlug);
        setEventData(event);
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event details');
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug, router]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        leaderName: user.displayName || '',
        leaderEmail: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear team name error when user types
    if (name === 'teamName') {
      setTeamNameError(null);
    }
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const checkTeamNameAvailability = async () => {
    if (!formData.teamName.trim()) return;
    
    try {
      const result = await api.checkTeamName(eventSlug, formData.teamName.trim());
      if (!result.available) {
        setTeamNameError('Team name already exists. Please choose a different name.');
        return false;
      }
      setTeamNameError(null);
      return true;
    } catch (error) {
      console.error('Error checking team name:', error);
      return true; // Allow submission, backend will validate
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to register');
      router.push('/login');
      return;
    }

    // Validation
    if (!formData.teamName || !formData.leaderName || !formData.leaderYear || 
        !formData.leaderEmail || !formData.leaderPhone || !formData.collegeName) {
      alert('Please fill all required fields');
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.leaderPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate team members (minimum 1)
    const filledMembers = teamMembers.filter((m) => m.name && m.email && m.phone);
    if (filledMembers.length < 1) {
      alert('At least 1 team member is required');
      return;
    }

    // Validate member phone numbers
    for (const member of filledMembers) {
      if (!/^\d{10}$/.test(member.phone.replace(/\D/g, ''))) {
        alert(`Please enter a valid 10-digit phone number for team member ${member.name}`);
        return;
      }
    }

    // Check team name availability
    const isTeamNameAvailable = await checkTeamNameAvailability();
    if (!isTeamNameAvailable) {
      return;
    }

    try {
      setSubmitting(true);

      const registrationData: EventRegistrationRequest = {
        team_name: formData.teamName.trim(),
        leader_name: formData.leaderName,
        leader_email: formData.leaderEmail,
        leader_phone: formData.leaderPhone.replace(/\D/g, ''),
        leader_year: formData.leaderYear,
        college_name: formData.collegeName,
        referral_id: formData.referralId || undefined,
        members: filledMembers.map(m => ({
          name: m.name,
          email: m.email,
          phone: m.phone.replace(/\D/g, ''),
        })),
      };

      await api.registerForEvent(eventSlug, registrationData);
      
      alert('Registration successful! Your team has been registered for this event.');
      router.push('/profile');
    } catch (error) {
      console.error('Error submitting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <PageSection title="Register" className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading event details...</p>
        </div>
      </PageSection>
    );
  }

  if (!eventData) {
    return null;
  }

  const minMembers = eventData.min_team_size - 1; // -1 because leader is counted
  const maxMembers = eventData.max_team_size - 1;

  return (
    <PageSection title={`Register - ${eventData.title}`} className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Event Info */}
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{eventData.title}</h2>
          <p className="text-gray-300 mb-6 text-lg">{eventData.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg">
              <span className="text-green-400 font-semibold text-lg">Free Registration</span>
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <span className="text-blue-400 font-semibold">
                Team Size: {eventData.min_team_size} - {eventData.max_team_size} members (including leader)
              </span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          {/* Team Name Section */}
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            Team Information
          </h3>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-red-400">
              Team Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              onBlur={checkTeamNameAvailability}
              required
              className={`w-full bg-black/50 border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${
                teamNameError 
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50' 
                  : 'border-red-900/30 focus:border-red-600 focus:ring-red-600/50'
              }`}
              placeholder="Enter a unique team name"
            />
            {teamNameError && (
              <p className="text-red-500 text-sm mt-2">{teamNameError}</p>
            )}
          </div>

          {/* Team Leader Section */}
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            Team Leader Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Leader Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="leaderName"
                value={formData.leaderName}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Year <span className="text-red-600">*</span>
              </label>
              <select
                name="leaderYear"
                value={formData.leaderYear}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="leaderEmail"
                value={formData.leaderEmail}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="leaderPhone"
                value={formData.leaderPhone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="9876543210"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-red-400">
                College Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="ABC College of Engineering"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-red-400">Referral ID (Optional)</label>
            <input
              type="text"
              name="referralId"
              value={formData.referralId}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="REF123456"
            />
          </div>

          {/* Team Members Section */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-red-900/50 pb-4">
              <h3 className="text-2xl font-bold text-white">
                Team Members ({minMembers}-{maxMembers} required)
              </h3>
              {teamMembers.length < maxMembers && (
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-red-600/30"
                >
                  + Add Member
                </button>
              )}
            </div>

            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-red-950/20 border border-red-900/30 rounded-xl p-6 relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-red-400">Member {index + 1}</h5>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-gray-400">
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        required
                        className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                        placeholder="Member name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2 text-gray-400">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                        required
                        className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                        placeholder="member@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2 text-gray-400">
                        Phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                        required
                        pattern="[0-9]{10}"
                        className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-red-900/50">
            <button
              type="submit"
              disabled={submitting || !!teamNameError}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Registering...
                </span>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </PageSection>
  );
}
