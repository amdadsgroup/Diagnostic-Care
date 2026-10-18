'use client';

import React, { Suspense } from 'react';
import DoctorDashboardPage from '@/app/doctor/dashboard/page';

export default function DoctorPortalRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading Doctor Portal...</div>}>
      <DoctorDashboardPage />
    </Suspense>
  );
}

