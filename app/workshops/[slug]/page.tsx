"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { api, type Workshop } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() as { user: FirebaseUser | null; loading: boolean };
  const workshopId = params.slug as string;

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const data = await api.getWorkshop(workshopId);
        setWorkshop(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workshop");
        console.error("Error fetching workshop:", err);
      } finally {
        setLoading(false);
      }
    };

    if (workshopId) {
      fetchWorkshop();
    }
  }, [workshopId]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!workshop) return;

    try {
      setProcessing(true);

      // Create order
      const orderData = await api.createWorkshopOrder(workshopId);

      // Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TALOS",
        description: `Registration for ${workshop.title}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.verifyWorkshopPayment(workshopId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Registration successful!");
            router.push("/profile");
          } catch (err) {
            alert(
              err instanceof Error ? err.message : "Payment verification failed"
            );
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.displayName || "",
        },
        theme: {
          color: "#dc2626",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <PageSection title="Workshop Details" className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (error || !workshop) {
    return (
      <PageSection title="Workshop Details" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">{error || "Workshop not found"}</p>
          <Link
            href="/workshops"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Workshops
          </Link>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Workshop Details" className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CardContainer className="w-full py-10">
          <CardBody className="w-full h-auto">
            <CardItem translateZ="100" className="w-full">
              <div
                className="h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(127, 29, 29, 0.9), rgba(0, 0, 0, 0.9)), url(${workshop.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                  {workshop.title}
                </h1>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold">
                {workshop.description}
              </p>
            </div>

            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Instructor
              </h3>
              <p className="text-gray-400 font-ibm-plex-mono font-bold text-lg">
                {workshop.instructor}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h4 className="text-xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Details
              </h4>
              <div className="space-y-4 text-base font-bold font-ibm-plex-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">{workshop.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{workshop.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-white">{workshop.duration}</span>
                </div>
                {workshop.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue</span>
                    <span className="text-white">{workshop.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="text-white text-lg">
                    ₹{workshop.registration_fee}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={processing || workshop.status !== "open"}
                className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing
                  ? "Processing..."
                  : workshop.status !== "open"
                  ? "Registration Closed"
                  : user
                  ? `Pay ₹${workshop.registration_fee} & Register`
                  : "Login to Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
