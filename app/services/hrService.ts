/**
 * API Service for HR Dashboard
 * Connects to the backend API for HR dashboard operations
 */

import { fetchWithAuth } from "@/app/utils/authHelper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ==================== INTERFACES ====================

export interface HRAlert {
  type: string;
  message: string;
  count: number;
}

export interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface GridCell {
  performance_level: string;
  potential_level: string;
  position: string;
  count: number;
}

export interface GridIntern {
  intern_id: number;
  full_name: string;
  department: string;
  pic_name: string;
  performance_score: number;
  potential_score: number;
  grid_position: string;
}

export interface HRDashboardStats {
  total_intern_active: number;
  total_pic: number;
  active_period: Period | null;
  grid_distribution: Record<string, number>;
  alerts: HRAlert[];
}

export interface DepartmentCount {
  department: string;
  count: number;
}

export interface PeriodAvg {
  period: string;
  avg_performance: number;
  avg_potential: number;
}

export interface ReportSummary {
  interns_by_department: DepartmentCount[];
  avg_performance_by_period: PeriodAvg[];
  grid_distribution_list: GridCell[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ==================== API FUNCTIONS ====================

/** Fetch HR Dashboard stats */
export async function fetchHRDashboard(period?: string): Promise<HRDashboardStats> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  const url = `${API_BASE_URL}/api/hr/dashboard${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to fetch HR dashboard stats");
  const json = await res.json();
  return json.data;
}

/** Fetch all interns with grid data (HR view) */
export async function fetchAllInternsWithGrid(
  page = 1,
  limit = 10,
  period?: string,
  gridPosition?: string,
  search?: string
): Promise<PaginatedResponse<GridIntern>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (period) params.set("period", period);
  if (gridPosition) params.set("grid_position", gridPosition);
  if (search) params.set("search", search);
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/interns?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch HR interns");
  const json = await res.json();
  // Backend wraps response in { success, message, data: { data, total, page, limit, total_pages } }
  const payload = json.data || json;
  return {
    data: payload.data || [],
    total: payload.total || 0,
    page: payload.page || 1,
    limit: payload.limit || limit,
    total_pages: payload.total_pages || 0,
  };
}

/** Assign PIC to an intern */
export async function assignPIC(internProfileId: number, picId: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/assign-pic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intern_profile_id: internProfileId, pic_id: picId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to assign PIC");
  }
}

/** Fetch all periods */
export async function fetchPeriods(): Promise<Period[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/periods`);
  if (!res.ok) throw new Error("Failed to fetch periods");
  const json = await res.json();
  return json.data || [];
}

/** Create a new period */
export async function createPeriod(name: string, startDate: string, endDate: string): Promise<Period> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/periods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, start_date: startDate, end_date: endDate }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create period");
  }
  const json = await res.json();
  return json.data;
}

/** Lock a period */
export async function lockPeriod(periodId: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/periods/${periodId}/lock`, {
    method: "PUT",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to lock period");
  }
}

/** Unlock a period (SuperAdmin only) */
export async function unlockPeriod(periodId: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/periods/${periodId}/unlock`, {
    method: "PUT",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to unlock period");
  }
}

/** Fetch 9 Grid overview */
export async function fetchNineGrid(period?: string): Promise<GridCell[]> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  const url = `${API_BASE_URL}/api/hr/nine-grid${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to fetch nine grid");
  const json = await res.json();
  return json.data || [];
}

/** Fetch interns in a specific grid cell */
export async function fetchGridInterns(position: string, period?: string): Promise<GridIntern[]> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  const url = `${API_BASE_URL}/api/hr/nine-grid/${position}${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to fetch grid interns");
  const json = await res.json();
  return json.data || [];
}

/** Fetch report data */
export async function fetchReport(period?: string, department?: string, pic?: string): Promise<ReportSummary> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  if (department) params.set("department", department);
  if (pic) params.set("pic", pic);
  const url = `${API_BASE_URL}/api/hr/reports${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to fetch report");
  const json = await res.json();
  return json.data;
}

/** Export data as CSV */
export async function exportData(format = "csv", period?: string): Promise<Blob> {
  const params = new URLSearchParams({ format });
  if (period) params.set("period", period);
  const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/export?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to export data");
  return await res.blob();
}
