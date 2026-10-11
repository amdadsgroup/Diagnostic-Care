'use client';

import React, { useState } from 'react';
import ComprehensiveAdminConsole from '@/components/admin/ComprehensiveAdminConsole';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPortalPage() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--slate-50)' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 16px' }}>
        <ComprehensiveAdminConsole />
      </main>
      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}

