// Define types for volunteer data
export interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  district: string;
  state: string;
  pincode: number;
  availability: string;
  interests: string[];
  experience?: string;
  reason: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  district: string;
  state: string;
  pincode: number;
  availability: string;
  interests: string[];
  experience?: string;
  reason: string;
}

export interface VolunteerResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    submittedAt: string;
  };
}

export interface VolunteersListResponse {
  success: boolean;
  data: Volunteer[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface VolunteerDetailResponse {
  success: boolean;
  data: Volunteer;
}

export interface DeleteVolunteerResponse {
  success: boolean;
  message: string;
}
