'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import MobileMessagesView from '@/components/patient/MobileMessagesView';
import SupportTicketModal from '@/components/support/SupportTicketModal';
import NotificationSettingsModal from '@/components/notifications/NotificationSettingsModal';
import LocationModal from '@/components/location/LocationModal';
import AuthModal from '@/components/auth/AuthModal';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { SupportedLanguage } from '@/config/brand';

export default function MessagesPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLoc = localStorage.getItem('dc_user_location');
      if (savedLoc) setSelectedLocation(savedLoc);

      AuthService.getCurrentUser().then((u) => {
        if (u) setCurrentUser(u);
      });
    }
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg, #F8FAFC)' }}>
      <Header
        language={language}
        setLanguage={handleLanguageChange}
        activeTab="messages"
        setActiveTab={(tab) => {
          if (tab === 'marketplace' || tab === 'home') {
            router.push('/');
          } else if (tab === 'search' || tab === 'doctors') {
            router.push('/doctors');
          } else if (tab === 'appointments' || tab === 'bookings') {
            router.push('/appointments');
          } else {
            router.push(`/?tab=${tab}`);
          }
        }}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '24px 16px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        <MobileMessagesView
          language={language}
          currentUser={currentUser}
          onNavigateTab={(tab) => {
            if (tab === 'marketplace' || tab === 'home') {
              router.push('/');
            } else if (tab === 'search' || tab === 'doctors') {
              router.push('/doctors');
            } else if (tab === 'appointments' || tab === 'bookings') {
              router.push('/appointments');
            } else {
              router.push(`/?tab=${tab}`);
            }
          }}
          onOpenSupportTicket={() => setIsSupportModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        />
      </main>

      <SupportTicketModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <NotificationSettingsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        language={language}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          if (typeof window !== 'undefined') localStorage.setItem('dc_user_location', loc);
          setIsLocationModalOpen(false);
        }}
        language={language}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setIsAuthModalOpen(false);
          setCurrentUser(profile);
        }}
      />

      <Footer language={language} setLanguage={handleLanguageChange} />
    </div>
  );
}
