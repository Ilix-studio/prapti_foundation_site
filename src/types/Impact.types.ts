// src/types/totalImpact.types.ts

export interface TotalImpact {
  _id: string;
  dogsRescued: number;
  dogsAdopted: number;
  volunteers: number;
  isActive: boolean;
  adoptionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTotalImpactRequest {
  dogsRescued: number;
  dogsAdopted: number;
  volunteers: number;
}

export interface UpdateTotalImpactRequest {
  dogsRescued?: number;
  dogsAdopted?: number;
  volunteers?: number;
  isActive?: boolean;
}

export interface TotalImpactResponse {
  success: boolean;
  message: string;
  data: TotalImpact;
}

export interface TotalImpactListResponse {
  success: boolean;
  data: TotalImpact[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface ImpactStatistics {
  totalDogsRescued: number;
  totalDogsAdopted: number;
  totalVolunteers: number;
  avgAdoptionRate: number;
  recordCount: number;
}

export interface ImpactStatsResponse {
  success: boolean;
  data: ImpactStatistics;
}

export interface TotalImpactFormData {
  title: string;
  description: string;
  dogsRescued: string; // String for form inputs
  dogsAdopted: string;
  volunteers: string;
}

export interface TotalImpactFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}
