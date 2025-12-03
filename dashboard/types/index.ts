export interface Alarm {
  index: number;
  label: "Morning" | "Afternoon" | "Evening";
  hour: number;
  minute: number;
  enabled: boolean;
}

export interface LogEntry {
  id: string;
  date: string;
  doseIndex: number;
  doseLabel: string;
  scheduledTime: string;
  actualTime: string | null;
  status: "taken" | "late" | "missed";
  delayMinutes: number | null;
  timestamp: number;
}

export interface DeviceStatus {
  online: boolean;
  lastSeen: string;
  currentAlarmActive: boolean;
  activeAlarmIndex: number | null;
  rtcTime: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
