'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageSection from '@/components/_core/layout/PageSection';
import { api, type Workshop, type WorkshopRegistrationRequest } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WorkshopRegistrationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workshopSlug = params?.slug as string;

  const [workshopData, setWorkshopData] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Form state - Solo registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    collegeName: '',
    referralId: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!workshopSlug) return;

      try {
        const workshop = await api.getWorkshop(workshopSlug);
        setWorkshopData(workshop);
      } catch (error) {
        console.error('Error fetching workshop:', error);
        alert('Failed to load workshop details');
        router.push('/workshops');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [workshopSlug, router]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setEmailError(null);
    }
  };

  const checkEmailRegistered = async () => {
    if (!formData.email.trim()) return;
    
    try {
      const result = await api.checkWorkshopEmail(workshopSlug, formData.email.trim());
      if (result.registered) {
        setEmailError('This email is already registered for this workshop.');
        return false;
      }
      setEmailError(null);
      return true;
    } catch (error) {
      console.error('Error checking email:', error);
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

    if (!workshopData) return;

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.year || !formData.collegeName) {
      alert('Please fill all required fields');
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if email is already registered
    const isEmailAvailable = await checkEmailRegistered();
    if (!isEmailAvailable) {
      return;
    }

    try {
      setSubmitting(true);

      const registrationData: WorkshopRegistrationRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        year: formData.year,
        college_name: formData.collegeName,
        referral_id: formData.referralId || undefined,
      };

      // Create order with registration data
      const orderData = await api.createWorkshopOrder(workshopSlug, registrationData);

      // Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TALOS',
        description: `Registration for ${workshopData.title}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment with registration data
            await api.verifyWorkshopPayment(workshopSlug, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: formData.name,
              email: formData.email,
              phone: formData.phone.replace(/\D/g, ''),
              year: formData.year,
              college_name: formData.collegeName,
              referral_id: formData.referralId || undefined,
            });
            alert('Registration successful! Payment completed.');
            router.push('/profile');
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Payment verification failed');
          }
        },
        prefill: {
          email: formData.email,
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: '#dc2626',
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.';
      alert(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <PageSection title="Register" className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading workshop details...</p>
        </div>
      </PageSection>
    );
  }

  if (!workshopData) {
    return null;
  }

  return (
    <PageSection title={`Register - ${workshopData.title}`} className="min-h-screen font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Workshop Info */}
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{workshopData.title}</h2>
          <p className="text-gray-300 mb-6 text-lg">{workshopData.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
              <span className="text-red-400 font-semibold text-lg">
                Registration Fee: ₹{workshopData.registration_fee}
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <span className="text-blue-400 font-semibold">Solo Registration</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-400">
              <span className="font-semibold">Instructor:</span> {workshopData.instructor}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Duration:</span> {workshopData.duration}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Date:</span> {workshopData.date}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Time:</span> {workshopData.time}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            Personal Information
          </h3>

          <div className="space-y-6">
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
                Year <span className="text-red-600">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={checkEmailRegistered}
                required
                className={`w-full bg-black/50 border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${
                  emailError 
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50' 
                    : 'border-red-900/30 focus:border-red-600 focus:ring-red-600/50'
                }`}
                placeholder="john@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Contact Number <span className="text-red-600">*</span>
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

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Referral ID (Optional)
              </label>
              <input
                type="text"
                name="referralId"
                value={formData.referralId}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="REF123456"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-red-900/50">
            <button
              type="submit"
              disabled={submitting || !!emailError}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                `Pay ₹${workshopData.registration_fee} & Register`
              )}
            </button>
          </div>
        </form>
      </div>
    </PageSection>
  );
}
