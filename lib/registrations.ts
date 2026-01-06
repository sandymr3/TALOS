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

// Event Registration Data - Team based
export interface EventRegistrationData {
  // Team Info
  team_name: string;
  
  // Leader Info
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_year: string;
  college_name: string;
  referral_id?: string;
  
  // Team Members (1-3)
  members: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  
  // Event Info
  event_id: string;
  event_name: string;
  
  // Metadata
  status: string;
  registered_at: any;
}

// Workshop Registration Data - Solo with payment
export interface WorkshopRegistrationData {
  // Participant Info
  name: string;
  email: string;
  phone: string;
  year: string;
  college_name: string;
  referral_id?: string;
  
  // Workshop Info
  workshop_id: string;
  workshop_name: string;
  
  // Payment Info
  payment_id: string;
  order_id: string;
  amount: number;
  payment_status: string;
  
  // Metadata
  status: string;
  registered_at: any;
  payment_completed_at?: any;
}

/**
 * Get all event registrations for a user by email
 * Searches across all event-specific collections
 */
export async function getUserEventRegistrations(userEmail: string): Promise<any[]> {
  if (!db) return [];

  try {
    const allRegistrations: any[] = [];

    // Get all events
    const eventsSnapshot = await getDocs(collection(db, 'events'));

    // Check each event's registrations
    for (const eventDoc of eventsSnapshot.docs) {
      const eventId = eventDoc.id;
      const eventData = eventDoc.data();
      const registrationsRef = collection(db, `${eventId}_registrations`);
      
      // Search by leader_email
      const q = query(registrationsRef, where('leader_email', '==', userEmail));
      const registrationsSnapshot = await getDocs(q);

      registrationsSnapshot.forEach((doc) => {
        const data = doc.data();
        allRegistrations.push({
          id: doc.id,
          event_name: eventData.title || eventId,
          event_id: eventId,
          ...data,
        });
      });
    }

    return allRegistrations;
  } catch (error) {
    console.error('Error fetching user event registrations:', error);
    return [];
  }
}

/**
 * Get all workshop registrations for a user by email
 * Searches across all workshop-specific collections
 */
export async function getUserWorkshopRegistrations(userEmail: string): Promise<any[]> {
  if (!db) return [];

  try {
    const allRegistrations: any[] = [];

    // Get all workshops
    const workshopsSnapshot = await getDocs(collection(db, 'workshops'));

    // Check each workshop's registrations
    for (const workshopDoc of workshopsSnapshot.docs) {
      const workshopId = workshopDoc.id;
      const workshopData = workshopDoc.data();
      const registrationsRef = collection(db, `${workshopId}_registrations`);
      
      // Search by email and confirmed status
      const q = query(
        registrationsRef, 
        where('email', '==', userEmail),
        where('status', '==', 'confirmed')
      );
      const registrationsSnapshot = await getDocs(q);

      registrationsSnapshot.forEach((doc) => {
        const data = doc.data();
        allRegistrations.push({
          id: doc.id,
          workshop_name: workshopData.title || workshopId,
          workshop_id: workshopId,
          ...data,
        });
      });
    }

    return allRegistrations;
  } catch (error) {
    console.error('Error fetching user workshop registrations:', error);
    return [];
  }
}
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
 * Check if team name is available for an event
 */
export async function isTeamNameAvailable(
  eventSlug: string,
  teamName: string
): Promise<boolean> {
  if (!db) return false;

  try {
    const registrationsRef = collection(db, `${eventSlug}_registrations`);
    const q = query(registrationsRef, where('team_name', '==', teamName));
    const snapshot = await getDocs(q);

    return snapshot.empty;
  } catch (error) {
    console.error('Error checking team name:', error);
    return false;
  }
}

/**
 * Check if user (by email) is already registered for an event
 */
export async function isUserRegisteredForEvent(
  eventSlug: string,
  userEmail: string
): Promise<boolean> {
  if (!db) return false;

  try {
    const registrationsRef = collection(db, `${eventSlug}_registrations`);
    const q = query(registrationsRef, where('leader_email', '==', userEmail));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}

/**
 * Check if user (by email) is already registered for a workshop
 */
export async function isUserRegisteredForWorkshop(
  workshopSlug: string,
  userEmail: string
): Promise<boolean> {
  if (!db) return false;

  try {
    const registrationsRef = collection(db, `${workshopSlug}_registrations`);
    const q = query(
      registrationsRef, 
      where('email', '==', userEmail),
      where('status', '==', 'confirmed')
    );
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking workshop registration:', error);
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

/**
 * Get all registrations for a specific workshop (admin use)
 */
export async function getWorkshopRegistrations(workshopSlug: string): Promise<any[]> {
  if (!db) return [];

  try {
    const registrationsRef = collection(db, `${workshopSlug}_registrations`);
    const snapshot = await getDocs(registrationsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching workshop registrations:', error);
    return [];
  }
}
