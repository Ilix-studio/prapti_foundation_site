export interface ITestimonial {
  id: string;
  quote: string;
  name: string;
  profession: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  rate?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TestimonialResponse {
  success: boolean;
  data: ITestimonial;
  message?: string;
}

export interface TestimonialsResponse {
  success: boolean;
  data: ITestimonial[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TestimonialCreateRequest {
  quote: string;
  name: string;
  profession: string;
  rate: number;
  recaptchaToken?: string;
}

export interface TestimonialUpdateRequest {
  quote?: string;
  name?: string;
  profession?: string;
  rate?: number;
  isActive?: boolean;
}

export interface TestimonialStats {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
  ratings: {
    averageRating: number;
    maxRating: number;
    minRating: number;
  };
}

export interface TestimonialStatsResponse {
  success: boolean;
  data: TestimonialStats;
}
export interface WriteTestimonialProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}
