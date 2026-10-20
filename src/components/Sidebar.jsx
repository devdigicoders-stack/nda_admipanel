import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  MessageSquare,
  Bell, 
  BookOpen, 
  Image as ImageIcon, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  Database
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, admin, onLogout, isMongoConnected }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'NDA & SSB Courses', icon: GraduationCap },
    { id: 'enquiries', label: 'Enquiries & Leads', icon: Users },
    { id: 'contacts', label: 'Contact Us Messages', icon: MessageSquare },
    { id: 'notices', label: 'Notices & Alerts', icon: Bell },
    { id: 'blogs', label: 'Defense Blogs', icon: BookOpen },
    { id: 'gallery', label: 'Academy Gallery', icon: ImageIcon },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-crest">
          <ShieldCheck size={26} color="#0B0F17" />
        </div>
        <div className="brand-text">
          <h2>SHAURYA DEFENCE</h2>
          <span>Admin Command</span>
        </div>
      </div>

      {/* Database status banner */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
          <Database size={13} color={isMongoConnected ? '#22c55e' : '#eab308'} />
          <span>DB: <strong style={{ color: isMongoConnected ? '#4ade80' : '#facc15' }}>{isMongoConnected ? 'MongoDB (Live)' : 'Memory & Seed Mode'}</strong></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div style={{ margin: '16px 0', borderTop: '1px solid var(--border-color)' }}></div>

        {/* Link to public website */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="nav-item"
          style={{ textDecoration: 'none', color: '#38bdf8' }}
        >
          <ExternalLink size={18} />
          <span>Open Live Website</span>
        </a>
      </nav>

      {/* Profile & Logout */}
      <div className="sidebar-footer">
        <div className="admin-profile-pill">
          <div className="profile-avatar">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="profile-info">
            <div className="profile-name">{admin?.name || 'Commandant Admin'}</div>
            <div className="profile-role">{admin?.email || 'admin@ndassb.academy'}</div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
