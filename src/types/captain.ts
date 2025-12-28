export interface Captain {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalJobs: number;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInSelfie?: string;
  checkInLocation?: { lat: number; lng: number };
  materialsChecked: string[];
  openingFuel: number;
  closingFuel?: number;
  odometer?: number;
  status: 'present' | 'absent' | 'half-day' | 'pending';
  notes?: string;
}

export interface Job {
  id: string;
  serviceType: string;
  serviceName: string;
  serviceIcon: string;
  customerName: string;
  customerPhone: string;
  address: string;
  location: { lat: number; lng: number };
  scheduledTime: string;
  estimatedDuration: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'cod';
  paymentAmount: number;
  distance?: number; // km from current location
  beforeImages: string[];
  afterImages: string[];
  completedSteps: string[];
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface Earnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalJobs: number;
  incentives: number;
  deductions: number;
}

export interface FuelEntry {
  date: string;
  opening: number;
  closing: number;
  distanceTraveled: number;
}
