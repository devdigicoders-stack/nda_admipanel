import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Enquiries from './pages/Enquiries';
import Notices from './pages/Notices';
import Blogs from './pages/Blogs';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import Candidates from './pages/Candidates';

const VALID_TABS = ['dashboard', 'candidates', 'courses', 'enquiries', 'contacts', 'notices', 'blogs', 'gallery'];

const getTabFromUrl = () => {
  // Check hash first: #/courses or #courses
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (VALID_TABS.includes(hashClean)) return hashClean;
  }
  // Check pathname: /courses
  const pathClean = window.location.pathname.replace(/^\//, '').toLowerCase();
  if (VALID_TABS.includes(pathClean)) return pathClean;

  return 'dashboard';
};

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state when browser Back / Forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    const token = api.getToken();
    const storedAdmin = api.getAdmin();
    if (token && storedAdmin) {
      setAdmin(storedAdmin);
    }
    setCheckingAuth(false);
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiBase}/health`);
      const data = await res.json();
      if (data && data.database && data.database.includes('MongoDB (Connected)')) {
        setIsMongoConnected(true);
      } else {
        setIsMongoConnected(false);
      }
    } catch {
      setIsMongoConnected(false);
    }
  };

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
    checkHealth();
  };

  const handleLogout = () => {
    api.logout();
    setAdmin(null);
    setSidebarOpen(false);
  };

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
    checkHealth();
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    // Update browser URL hash so URL reflects current page (e.g. #/courses, #/blogs)
    window.location.hash = `#/${tab}`;
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f17', color: '#94a3b8' }}>
        Verifying Academy Credentials...
      </div>
    );
  }

  if (!admin) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const titles = {
    dashboard: { title: 'Command Operations Dashboard', subtitle: 'Overview of student admissions, active courses, and academy alerts' },
    candidates: { title: 'Our Selected Cadets', subtitle: 'Add and manage recommended candidates with photo, entry, board, and AIR ranking' },
    courses: { title: 'NDA & SSB Course Management', subtitle: 'Configure course fee structures, durations, batch dates, and syllabus' },
    enquiries: { title: 'Student Admission Enquiries & Leads', subtitle: 'Track and follow up with student leads from website registration forms' },
    contacts: { title: 'Contact Us Messages & Inquiries', subtitle: 'Manage direct questions, general enquiries, and messages from the website contact page' },
    notices: { title: 'Academy Notices & Exam Alerts', subtitle: 'Broadcast UPSC notifications, SSB call letter updates, and results' },
    blogs: { title: 'Defense Preparation Articles', subtitle: 'Curate tactical SSB strategies, PPDT advice, and current affairs' },
    gallery: { title: 'Academy Dynamic Gallery', subtitle: 'Showcase GTO grounds, obstacle courses, and recommended officers' }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        admin={admin}
        onLogout={handleLogout}
        isMongoConnected={isMongoConnected}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <Header
          title={titles[activeTab]?.title || 'Command Center'}
          subtitle={titles[activeTab]?.subtitle}
          onRefresh={handleManualRefresh}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        <main className="admin-content" key={refreshKey}>
          {activeTab === 'dashboard' && <Dashboard setActiveTab={handleSelectTab} />}
          {activeTab === 'candidates' && <Candidates />}
          {activeTab === 'courses' && <Courses />}
          {activeTab === 'enquiries' && <Enquiries />}
          {activeTab === 'contacts' && <Contacts />}
          {activeTab === 'notices' && <Notices />}
          {activeTab === 'blogs' && <Blogs />}
          {activeTab === 'gallery' && <Gallery />}
        </main>
      </div>
    </div>
  );
}
