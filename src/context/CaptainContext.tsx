"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Captain, AttendanceRecord, Job, Earnings } from '@/types/captain';

interface CaptainContextType {
  captain: Captain;
  isCheckedIn: boolean;
  todayAttendance: AttendanceRecord | null;
  jobs: Job[];
  activeJob: Job | null;
  earnings: Earnings;
  checkIn: (record: Partial<AttendanceRecord>) => void;
  checkOut: (closingFuel: number, notes?: string) => void;
  setActiveJob: (job: Job | null) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  completeJob: (jobId: string, afterImages: string[], notes?: string) => void;
}

const mockCaptain: Captain = {
  id: "CAP001",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  rating: 4.8,
  totalJobs: 342,
  joinedDate: "2023-06-15",
};

const mockJobs: Job[] = [
  {
    id: "JOB001",
    serviceType: "car_wash",
    serviceName: "Car Wash & Detailing",
    serviceIcon: "🚗",
    customerName: "Amit Sharma",
    customerPhone: "+91 99887 76655",
    address: "A-204, Green Valley Apartments, Sector 45, Gurugram",
    location: { lat: 28.4595, lng: 77.0266 },
    scheduledTime: "09:00 AM",
    estimatedDuration: 45,
    status: "scheduled",
    paymentStatus: "pending",
    paymentAmount: 599,
    distance: 2.5,
    beforeImages: [],
    afterImages: [],
    completedSteps: [],
  },
  {
    id: "JOB002",
    serviceType: "sofa_cleaning",
    serviceName: "Sofa Deep Cleaning",
    serviceIcon: "🛋️",
    customerName: "Priya Patel",
    customerPhone: "+91 88776 65544",
    address: "B-12, Sunshine Towers, MG Road, Bangalore",
    location: { lat: 12.9716, lng: 77.5946 },
    scheduledTime: "11:30 AM",
    estimatedDuration: 60,
    status: "scheduled",
    paymentStatus: "paid",
    paymentAmount: 1299,
    distance: 4.2,
    beforeImages: [],
    afterImages: [],
    completedSteps: [],
  },
  {
    id: "JOB003",
    serviceType: "home_cleaning",
    serviceName: "Home Deep Cleaning",
    serviceIcon: "🏠",
    customerName: "Vikram Singh",
    customerPhone: "+91 77665 54433",
    address: "C-78, Palm Grove Society, Andheri West, Mumbai",
    location: { lat: 19.1196, lng: 72.8463 },
    scheduledTime: "03:00 PM",
    estimatedDuration: 120,
    status: "scheduled",
    paymentStatus: "cod",
    paymentAmount: 2499,
    distance: 6.8,
    beforeImages: [],
    afterImages: [],
    completedSteps: [],
  },
];

const mockEarnings: Earnings = {
  today: 1898,
  thisWeek: 12450,
  thisMonth: 48750,
  totalJobs: 28,
  incentives: 2500,
  deductions: 350,
};

const CaptainContext = createContext<CaptainContextType | undefined>(undefined);

export function CaptainProvider({ children }: { children: ReactNode }) {
  const [captain] = useState<Captain>(mockCaptain);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [earnings] = useState<Earnings>(mockEarnings);

  const checkIn = (record: Partial<AttendanceRecord>) => {
    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString(),
      materialsChecked: record.materialsChecked || [],
      openingFuel: record.openingFuel || 0,
      checkInSelfie: record.checkInSelfie,
      checkInLocation: record.checkInLocation,
      status: 'present',
    };
    setTodayAttendance(newRecord);
    setIsCheckedIn(true);
  };

  const checkOut = (closingFuel: number, notes?: string) => {
    if (todayAttendance) {
      setTodayAttendance({
        ...todayAttendance,
        checkOutTime: new Date().toLocaleTimeString(),
        closingFuel,
        notes,
      });
    }
    setIsCheckedIn(false);
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
    if (activeJob?.id === jobId) {
      setActiveJob(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const completeJob = (jobId: string, afterImages: string[], notes?: string) => {
    updateJob(jobId, {
      status: 'completed',
      afterImages,
      completedAt: new Date().toISOString(),
      notes,
    });
    setActiveJob(null);
  };

  return (
    <CaptainContext.Provider value={{
      captain,
      isCheckedIn,
      todayAttendance,
      jobs,
      activeJob,
      earnings,
      checkIn,
      checkOut,
      setActiveJob,
      updateJob,
      completeJob,
    }}>
      {children}
    </CaptainContext.Provider>
  );
}

export function useCaptain() {
  const context = useContext(CaptainContext);
  if (context === undefined) {
    throw new Error('useCaptain must be used within a CaptainProvider');
  }
  return context;
}
