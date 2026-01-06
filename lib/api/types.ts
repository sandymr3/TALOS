// API Types matching backend models

export interface Event {
  event_id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue?: string;
  image_url: string;
  max_participants?: number;
  registration_fee: number;
  is_team_event: boolean;
  max_team_size?: number;
  status: "open" | "closed" | "cancelled";
  created_at: string;
}

export interface TeamMember {
  name: string;
  email: string;
  phone?: string;
}

export interface EventRegistrationRequest {
  registration_type: "solo" | "team";
  team_name?: string;
  team_members?: TeamMember[];
}

export interface EventRegistration {
  registration_id: string;
  user_id: string;
  event_id: string;
  registration_type: string;
  team_name?: string;
  team_members?: TeamMember[];
  status: string;
  registered_at: string;
}

export interface Workshop {
  workshop_id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  venue?: string;
  image_url: string;
  max_participants?: number;
  registration_fee: number;
  status: "open" | "closed" | "cancelled";
  created_at: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface WorkshopRegistration {
  registration_id: string;
  user_id: string;
  workshop_id: string;
  payment_id: string;
  order_id: string;
  amount: number;
  payment_status: string;
  status: string;
  registered_at: string;
  payment_completed_at?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  profile_photo?: string;
  created_at: string;
  last_login: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  college?: string;
}

export interface ApiError {
  detail: string;
}
