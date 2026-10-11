'use client';

import React, { useState, useEffect } from 'react';
import { AdminSection } from './AdminTypes';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import { AdminService, AdminDashboardMetrics } from '@/services/admin.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { useLanguage } from '@/context/LanguageContext';

// 17 Module Components
import DashboardOverviewTab from './tabs/DashboardOverviewTab';
import UsersAccessTab from './tabs/UsersAccessTab';
import DoctorsTab from './tabs/DoctorsTab';
import HospitalsTab from './tabs/HospitalsTab';
import DiagnosticCentersTab from './tabs/DiagnosticCentersTab';
import PharmaciesTab from './tabs/PharmaciesTab';
import AmbulancesTab from './tabs/AmbulancesTab';
import HomeCareTab from './tabs/HomeCareTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import ServicesMarketplaceTab from './tabs/ServicesMarketplaceTab';
import FinanceTab from './tabs/FinanceTab';
import SupportTab from './tabs/SupportTab';
import ContentManagementTab from './tabs/ContentManagementTab';
import ReportsAnalyticsTab from './tabs/ReportsAnalyticsTab';
import NotificationsTab from './tabs/NotificationsTab';
import AuditLogsTab from './tabs/AuditLogsTab';
import SystemSettingsTab from './tabs/SystemSettingsTab';

export default function ComprehensiveAdminConsole() {
  const { language, setLanguage } = useLanguage();
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Fetch current super admin profile
  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getDashboardMetrics(dateFilter);
      setMetrics(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateFilter]);

  const handleLogout = async () => {
    await AuthService.signOut();
    window.location.href = '/admin/login';
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: 'inherit',
      }}
    >
      {/* 1. Futuristic Glassmorphism Sidebar (17 Modules) */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        language={language}
        counts={{
          users: metrics?.totalUsers,
          doctors: metrics?.activeDoctors,
          pendingVerif: metrics?.pendingDoctorVerifications,
          hospitals: (metrics?.hospitals || 0) + (metrics?.clinics || 0),
          diagnosticCenters: metrics?.diagnosticCenters,
          pharmacies: metrics?.pharmacies,
          ambulances: metrics?.ambulanceProviders,
          homeCare: metrics?.homeCareProviders,
          appointments: metrics?.totalAppointments,
          notifications: 3,
        }}
      />

      {/* 2. Main Content Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header */}
        <AdminTopNav
          currentSection={currentSection}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          currentUser={currentUser}
          onLogout={handleLogout}
          onRefresh={fetchMetrics}
          isLoading={loading}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Dynamic Tab Body */}
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {currentSection === 'dashboard' && (
            <DashboardOverviewTab
              metrics={metrics}
              language={language}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              onNavigateSection={setCurrentSection}
            />
          )}

          {currentSection === 'users' && (
            <UsersAccessTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'doctors' && (
            <DoctorsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'hospitals' && (
            <HospitalsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'diagnostic-centers' && (
            <DiagnosticCentersTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'pharmacies' && (
            <PharmaciesTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'ambulances' && (
            <AmbulancesTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'home-care' && (
            <HomeCareTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'appointments' && (
            <AppointmentsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'services' && (
            <ServicesMarketplaceTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'finance' && (
            <FinanceTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'support' && (
            <SupportTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'content' && (
            <ContentManagementTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'reports' && (
            <ReportsAnalyticsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'notifications' && (
            <NotificationsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'audit-logs' && (
            <AuditLogsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}

          {currentSection === 'settings' && (
            <SystemSettingsTab language={language} adminEmail={currentUser?.email || 'contact.amdadur@gmail.com'} />
          )}
        </main>
      </div>
    </div>
  );
}
