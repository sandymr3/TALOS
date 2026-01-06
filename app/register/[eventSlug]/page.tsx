'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PageSection from '@/components/_core/layout/PageSection';

interface EventData {
  title: string;
  description: string;
  isPaid: boolean;
  fee: number;
  isGroup: boolean;
  maxTeamSize: number;
  minTeamSize: number;
  rules?: string[];
}

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

export default function EventRegistrationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventSlug = params?.eventSlug as string;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    email: '',
    phone: '',
    collegeName: '',
    refId: '',
    teamName: '',
  });

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
      if (!eventSlug || !db) return;

      try {
        const eventRef = doc(db, 'events', eventSlug);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEventData(eventSnap.data() as EventData);
        } else {
          alert('Event not found');
          router.push('/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event details');
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
        name: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (eventData && teamMembers.length < (eventData.maxTeamSize - 1)) {
      setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const removeTeamMember = (index: number) => {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !db) {
      alert('Please login to register');
      return;
    }

    // Validation
    if (!formData.name || !formData.department || !formData.year || !formData.email || !formData.phone || !formData.collegeName) {
      alert('Please fill all required fields');
      return;
    }

    if (eventData?.isGroup) {
        if(!formData.teamName) {
            alert('Please enter team name');
            return;
        }

        // Check if team name is unique
        try {
            setSubmitting(true);
            const registrationsRef = collection(db, `${eventSlug}_registrations`);
            const q = query(registrationsRef, where('teamName', '==', formData.teamName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert('Team name already exists. Please choose a different name.');
                setSubmitting(false);
                return;
            }
        } catch (error) {
            console.error("Error checking team name uniqueness", error);
            alert("Error checking team name. Please try again.");
            setSubmitting(false);
            return;
        }

        // Check min team size (including the logged-in user)
        const filledMembers = teamMembers.filter((m) => m.name && m.email && m.phone);
        // Total members = 1 (user) + filledMembers
        if ((filledMembers.length + 1) < (eventData.minTeamSize)) {
            alert(`Team requires at least ${eventData.minTeamSize} members (including you).`);
            setSubmitting(false);
            return;
        }
    }

    try {
      setSubmitting(true);

      const registrationData = {
        // User details
        userId: user.uid,
        userEmail: user.email,
        userName: formData.name,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
        collegeName: formData.collegeName,
        refId: formData.refId,

        // Team details
        isTeamRegistration: eventData?.isGroup || false,
        teamName: eventData?.isGroup ? formData.teamName : null,
        teamMembers: eventData?.isGroup
          ? teamMembers.filter((m) => m.name && m.email && m.phone)
          : [],

        // Event details
        eventSlug,
        eventName: eventData?.title,

        // Payment details
        paymentStatus: eventData?.isPaid ? 'pending' : 'not_required',
        paymentAmount: eventData?.isPaid ? eventData.fee : 0,

        // Metadata
        registrationDate: serverTimestamp(),
        status: 'confirmed',
      };

      // Store in event-specific collection
      const registrationsRef = collection(db, `${eventSlug}_registrations`);
      await addDoc(registrationsRef, registrationData);

      alert('Registration successful!');
      router.push('/');
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Registration failed. Please try again.');
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

  return (
    <PageSection title={`Register - ${eventData.title}`} className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Event Info */}
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{eventData.title}</h2>
          <p className="text-gray-300 mb-6 text-lg">{eventData.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            {eventData.isPaid ? (
              <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
                <span className="text-red-400 font-semibold text-lg">Registration Fee: ₹{eventData.fee}</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg">
                <span className="text-green-400 font-semibold text-lg">Free Event</span>
              </div>
            )}
            {eventData.isGroup && (
              <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                <span className="text-blue-400 font-semibold">
                  Team Size: {eventData.minTeamSize} - {eventData.maxTeamSize} members
                </span>
              </div>
            )}
          </div>

          {eventData.rules && eventData.rules.length > 0 && (
            <details className="mt-6 group">
              <summary className="cursor-pointer font-semibold text-white/80 hover:text-red-400 transition-colors select-none">
                Rules & Regulations
              </summary>
              <div className="mt-4 text-sm text-gray-300 space-y-2 p-4 bg-black/30 rounded-lg">
                <ul className="list-disc pl-5 space-y-2">
                  {eventData.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </details>
          )}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Department <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Year <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="2nd Year"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="9876543210"
              />
            </div>

            <div>
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
            <label className="block text-sm font-semibold mb-2 text-red-400">Reference ID (Optional)</label>
            <input
              type="text"
              name="refId"
              value={formData.refId}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="REF123456"
            />
          </div>

          {/* Team Details */}
          {eventData.isGroup && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
                Team Information
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-red-400">
                  Team Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                  placeholder="The Avengers"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Team Members (Optional)</h4>
                  {teamMembers.length < (eventData.maxTeamSize - 1) && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-red-600/30"
                    >
                      + Add Member
                    </button>
                  )}
                </div>

                <div className="grid gap-4">
                    {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-red-950/20 border border-red-900/30 rounded-xl p-6 relative"
                    >
                        <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-red-400">Member {index + 1}</h5>
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
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-red-900/50">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : eventData.isPaid ? (
                'Proceed to Payment'
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
