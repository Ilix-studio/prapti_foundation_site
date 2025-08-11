// Define interfaces for visitor API responses
export interface VisitorCountResponse {
  success: boolean;
  count: number;
  message?: string;
}

export interface DailyStat {
  date: string;
  count: number;
}

export interface WeeklyStats {
  thisWeek: number;
  lastWeek: number;
  growth: number;
}

export interface VisitorStatsResponse {
  success: boolean;
  data: {
    totalVisitors: number;
    todayVisitors: number;
    lastVisit: string | null;
    dailyStats: DailyStat[];
    weeklyStats: WeeklyStats;
  };
}

export interface VisitorResetResponse {
  success: boolean;
  message: string;
  count: number;
}
