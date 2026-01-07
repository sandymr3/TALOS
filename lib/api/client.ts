import { auth } from "@/lib/firebase";
import type {
  Event,
  EventRegistration,
  EventRegistrationRequest,
  Workshop,
  WorkshopRegistration,
  WorkshopRegistrationRequest,
  CreateOrderResponse,
  PaymentVerificationRequest,
  User,
  UserUpdate,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    if (!auth?.currentUser) {
      return null;
    }
    return auth.currentUser.getIdToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "An error occurred" }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
         console.error(`Network error connecting to ${url}`, error);
         throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
      }
      throw error;
    }
  }

  // ============== Events ==============

  async getEvents(status?: string): Promise<Event[]> {
    const params = status ? `?status=${status}` : "";
    return this.request<Event[]>(`/api/events${params}`);
  }

  async getEvent(eventId: string): Promise<Event> {
    return this.request<Event>(`/api/events/${eventId}`);
  }

  async registerForEvent(
    eventId: string,
    registration: EventRegistrationRequest
  ): Promise<{ message: string; registration_id: string; team_name: string }> {
    return this.request(`/api/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(registration),
    });
  }

  async checkTeamName(
    eventId: string,
    teamName: string
  ): Promise<{ available: boolean }> {
    return this.request(`/api/events/${eventId}/check-team-name?team_name=${encodeURIComponent(teamName)}`);
  }

  // ============== Workshops ==============

  async getWorkshops(status?: string): Promise<Workshop[]> {
    const params = status ? `?status=${status}` : "";
    return this.request<Workshop[]>(`/api/workshops${params}`);
  }

  async getWorkshop(workshopId: string): Promise<Workshop> {
    return this.request<Workshop>(`/api/workshops/${workshopId}`);
  }

  async createWorkshopOrder(
    workshopId: string,
    registration: WorkshopRegistrationRequest
  ): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>(
      `/api/workshops/${workshopId}/create-order`,
      {
        method: "POST",
        body: JSON.stringify(registration),
      }
    );
  }

  async verifyWorkshopPayment(
    workshopId: string,
    verification: PaymentVerificationRequest
  ): Promise<{ message: string; registration_id: string }> {
    return this.request(`/api/workshops/${workshopId}/verify-payment`, {
      method: "POST",
      body: JSON.stringify(verification),
    });
  }

  async checkWorkshopEmail(
    workshopId: string,
    email: string
  ): Promise<{ registered: boolean }> {
    return this.request(`/api/workshops/${workshopId}/check-email?email=${encodeURIComponent(email)}`);
  }

  // ============== User ==============

  async getUserProfile(): Promise<User> {
    return this.request<User>("/api/user/profile");
  }

  async updateUserProfile(update: UserUpdate): Promise<User> {
    return this.request<User>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(update),
    });
  }

  async getUserEvents(): Promise<EventRegistration[]> {
    return this.request<EventRegistration[]>("/api/user/events");
  }

  async getUserWorkshops(): Promise<WorkshopRegistration[]> {
    return this.request<WorkshopRegistration[]>("/api/user/workshops");
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export types for convenience
export * from "./types";
