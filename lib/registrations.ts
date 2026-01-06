import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface RegistrationData {
  userId: string;
  userEmail: string;
  userName: string;
  department: string;
  year: string;
  phone: string;
  collegeName: string;
  collegeAddress: string;
  refId?: string;
  isTeamRegistration: boolean;
  teamName?: string;
  teamMembers?: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  eventSlug: string;
  eventName: string;
  paymentStatus: 'pending' | 'completed' | 'not_required';
  paymentAmount: number;
  registrationDate: any;
  status: string;
}

/**
 * Submit a registration for a specific event
 * Stores registration in event-specific collection: {eventSlug}_registrations
 */
export async function submitRegistration(
  eventSlug: string,
  registrationData: RegistrationData
): Promise<{ success: boolean; registrationId?: string; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  try {
    const registrationsRef = collection(db, `${eventSlug}_registrations`);
    const docRef = await addDoc(registrationsRef, {
      ...registrationData,
      registrationDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return { success: true, registrationId: docRef.id };
  } catch (error) {
    console.error('Error submitting registration:', error);
    return { success: false, error: 'Failed to submit registration' };
  }
}

/**
 * Get all registrations for a specific user
 */
export async function getUserRegistrations(userEmail: string): Promise<any[]> {
  if (!db) return [];

  try {
    const allRegistrations: any[] = [];

    // Get all events
    const eventsSnapshot = await getDocs(collection(db, 'events'));

    // Check each event's registrations
    for (const eventDoc of eventsSnapshot.docs) {
      const eventSlug = eventDoc.id;
      const eventData = eventDoc.data();
      const registrationsRef = collection(db, `${eventSlug}_registrations`);
      const q = query(registrationsRef, where('userEmail', '==', userEmail));
      const registrationsSnapshot = await getDocs(q);

      registrationsSnapshot.forEach((doc) => {
        const data = doc.data();
        allRegistrations.push({
          id: doc.id,
          eventName: eventData.title || eventSlug,
          eventSlug: eventSlug,
          ...data,
        });
      });
    }

    return allRegistrations;
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }
}

/**
 * Get a specific event's details
 */
export async function getEventDetails(eventSlug: string): Promise<any | null> {
  if (!db) return null;

  try {
    const eventRef = doc(db, 'events', eventSlug);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

/**
 * Update payment status for a registration
 */
export async function updatePaymentStatus(
  eventSlug: string,
  registrationId: string,
  paymentStatus: 'pending' | 'completed' | 'not_required',
  paymentId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  try {
    const registrationRef = doc(db, `${eventSlug}_registrations`, registrationId);
    await updateDoc(registrationRef, {
      paymentStatus,
      paymentId: paymentId || null,
      paymentUpdatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

/**
 * Check if user is already registered for an event
 */
export async function isUserRegistered(
  eventSlug: string,
  userEmail: string
): Promise<boolean> {
  if (!db) return false;

  try {
    const registrationsRef = collection(db, `${eventSlug}_registrations`);
    const q = query(registrationsRef, where('userEmail', '==', userEmail));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}

/**
 * Get all registrations for a specific event (admin use)
 */
export async function getEventRegistrations(eventSlug: string): Promise<any[]> {
  if (!db) return [];

  try {
    const registrationsRef = collection(db, `${eventSlug}_registrations`);
    const snapshot = await getDocs(registrationsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
}
