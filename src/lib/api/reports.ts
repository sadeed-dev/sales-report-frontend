import apiClient from './client';

export interface CallLogsParams {
  format?: 'json' | 'xlsx' | 'image' | 'images' | 'png';
  from_date?: string;
  to_date?: string;
  from?: string;
  to?: string;
  talktime_threshold?: number;
  branch?: string;
}

export interface EmployeeRecord {
  name?: string;
  show_name?: string;
  work_email?: string;
  job_position?: string;
  work_mobile?: string;
  work_phone?: string;
  department?: string;
  branch?: string;
  user_id?: string;
  biometric_id?: string;
}

export interface AttendanceEntry {
  EmpName?: string;
  EmpCode?: string;
  Branch_Name?: string;
  Dept_Name?: string;
  PunchDate?: string;
  PunchDateFormatted?: string;
  CheckInTime?: string;
  CheckOutTime?: string;
  TotalMinutes?: number;
  TotalHours?: string;
}

export interface EmployeesResponse {
  status: string;
  results: number;
  data: {
    employees: EmployeeRecord[];
  };
}

export interface AttendanceResponse {
  status: string;
  results: number;
  meta?: {
    from?: string;
    to?: string;
    type?: string;
  };
  data: {
    attendance: AttendanceEntry[];
  };
}

export interface CallLogsResponse {
  status: string;
  data: {
    summary: CallLogEntry[];
  };
  metadata?: {
    from_date: string;
    to_date: string;
    format: string;
    talktime_threshold?: number;
  };
}

export interface CallLogEntry {
  sr_no: number;
  source: string;
  user_name: string;
  phone_number: string | null;
  branch: string | null;
  empId: string | null;
  total_calls: number;
  connected_calls: number;
  not_connected_calls: number;
  total_talk_time_sec: number;
  avg_talk_time_sec: number;
  total_talk_time: string;
  avg_talk_time: string;
  talktime_percentage?: number;
}

export interface LeadListReportParams {
  from_date?: string;
  to_date?: string;
  min_calls?: number;
}

export interface LeadListDispositionRow {
  key: string;
  label: string;
  isPercent: boolean;
  values: Record<string, number>;
  grand_total: number;
}

export interface LeadListDispositionCategory {
  key: string;
  label: string;
  icon: string;
  rows: LeadListDispositionRow[];
}

export interface LeadListTopPerformer {
  list_name: string;
  total_interested_pct: number;
  total_interested: number;
  grand_total: number;
}

export interface LeadListHighlight {
  list_name: string;
  grand_total?: number;
  total_interested?: number;
}

export interface LeadListDispositionResponse {
  status: string;
  meta: {
    from_date: string;
    to_date: string;
    min_calls_threshold: number;
    generated_at: string;
  };
  data: {
    summary: {
      total_calls: number;
      interested: number;
      sec_300_plus: number;
      total_interested: number;
      overall_conversion_pct: number;
    };
    lead_lists: string[];
    top_performing_lists: LeadListTopPerformer[];
    highlights: {
      highest_volume: LeadListHighlight | null;
      highest_total_interested: LeadListHighlight | null;
    };
    categories: LeadListDispositionCategory[];
    grand_total_row: LeadListDispositionRow | null;
  };
}

// Reports API endpoints
const reportAPI = {
  // Get Lead List Performance & Disposition Report
  getLeadListDispositionReport: async (params?: LeadListReportParams) => {
    const response = await apiClient.get<LeadListDispositionResponse>(
      '/reports/dispositions/lead-lists',
      { params }
    );
    return response.data;
  },

  // Get TATA call logs
  getTataCallLogs: async (params?: CallLogsParams) => {
    console.log('📡 getTataCallLogs called with:', params);
    const response = await apiClient.get<CallLogsResponse>('/reports/tata/call-logs', {
      params,
    });
    
    console.log('📡 getTataCallLogs response:', response.data);
    return response.data;
  },
                                      
  // Get VI call logs
  getVICallLogs: async (params?: CallLogsParams) => {
    const response = await apiClient.get<CallLogsResponse>('/reports/vi/call-logs', {
      params,
    });
    console.log('📡 getVICallLogs response:', response.data);
    return response.data;
  },

  // Get combined call logs
  getCombinedCallLogs: async (params?: CallLogsParams) => {
    console.log('📡 getCombinedCallLogs called with:', params);
    const response = await apiClient.post<CallLogsResponse>('/reports/combined/call-logs', params);
    console.log('📡 getCombinedCallLogs response:', response.data);
    return response.data;
  },

  // Get AIRTEL call logs
  getAirtelCallLogs: async (params?: CallLogsParams) => {
    console.log('📡 getAirtelCallLogs called with:', params);
    const response = await apiClient.post<CallLogsResponse>('/reports/airtel/call-logs', params);
    console.log('📡 getAirtelCallLogs response:', response.data);
    return response.data;
  },

  // Get attendance
  getAttendance: async (params?: CallLogsParams) => {
    const response = await apiClient.get<AttendanceResponse>('/reports/attendance', {
      params,
    });
    return response.data;
  },

  // Get employees
  getEmployees: async (params?: CallLogsParams) => {
    const response = await apiClient.get<EmployeesResponse>('/reports/employees', {
      params,
    });
    return response.data;
  },

  // Get dispo logs
  getDispoLogs: async (params?: any) => {
    const response = await apiClient.get<any>('/reports/tata/dispo-logs', {
      params,
    });
    return response.data;
  },

  // Get late arrival images (after 9:30 AM)
  getLateArrivalImages: async (params?: CallLogsParams) => {
    const response = await apiClient.get<any>('/reports/attendance/late-arrivals', {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // Get absent users images - all branches combined (not punched in by 9:50 AM)
  getAbsentUsersImages: async (params?: CallLogsParams) => {
    const response = await apiClient.get<any>('/reports/attendance/absent-users', {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // Get absent users images - branch-wise (not punched in by 9:50 AM)
  getAbsentUsersBranchwiseImages: async (params?: CallLogsParams) => {
    const response = await apiClient.get<any>('/reports/attendance/absent-users-branchwise', {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // Get absent users images - department-wise
  getAbsentUsersDepartmentwiseImages: async (params?: CallLogsParams) => {
    const response = await apiClient.get<any>('/reports/attendance/absent-users-departmentwise', {
      params,
      responseType: 'blob',
      timeout: 120000,
    });
    return response;
  },
};

export default reportAPI;
