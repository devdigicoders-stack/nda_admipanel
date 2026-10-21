import React, { useEffect, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Bell, 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Phone
} from 'lucide-react';
import { api } from '../api';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.updateEnquiry(enquiryId, { status: newStatus });
      fetchStats();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
        Loading Command Statistics...
      </div>
    );
  }

  const s = stats || {
    totalEnquiries: 0,
    pendingEnquiries: 0,
    contactedEnquiries: 0,
    enrolledEnquiries: 0,
    totalContacts: 0,
    pendingContacts: 0,
    totalCourses: 0,
    totalNotices: 0,
    totalBlogs: 0,
    recentEnquiries: [],
    recentContacts: [],
    recentNotices: []
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{s.totalEnquiries}</div>
            <div className="stat-label">Total Student Enquiries</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{s.pendingEnquiries}</div>
            <div className="stat-label">Pending Follow-ups</div>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contacts')} title="Click to view Contact Us messages">
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="stat-value">{s.totalContacts ?? 0}</div>
            <div className="stat-label">Contact Us Messages ({s.pendingContacts ?? 0} New)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{s.enrolledEnquiries}</div>
            <div className="stat-label">Confirmed Enrolled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="stat-value">{s.totalCourses}</div>
            <div className="stat-label">Active NDA/SSB Courses</div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Enquiries & Notices */}
      <div className="dashboard-content-grid">
        {/* Recent Enquiries */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#eab308" />
              <span>Recent Inquiries</span>
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('enquiries')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="table-container desktop-only">
            <table style={{ minWidth: '460px' }}>
              <thead>
                <tr>
                  <th>Cadet Name</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {s.recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                      No enquiries yet. Test by submitting from the website!
                    </td>
                  </tr>
                ) : (
                  s.recentEnquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{enq.name}</div>
                        <a 
                          href={`tel:${enq.phone}`} 
                          style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Click to call"
                        >
                          <Phone size={11} />
                          <span>{enq.phone}</span>
                        </a>
                      </td>
                      <td style={{ fontSize: '13px', color: '#cbd5e1' }}>
                        {enq.courseInterested}
                      </td>
                      <td>
                        <span className={`pill pill-${enq.status.toLowerCase()}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={enq.status}
                          onChange={(e) => handleQuickStatusChange(enq._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            borderColor: '#334155',
                            color: '#f8fafc'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Optimized for Phone Screen) */}
          <div className="mobile-only mobile-inquiries-list">
            {s.recentEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                No enquiries yet. Test by submitting from the website!
              </div>
            ) : (
              s.recentEnquiries.map((enq) => (
                <div key={enq._id} className="mobile-inquiry-item">
                  <div className="mobile-inquiry-top">
                    <div>
                      <div className="mobile-inquiry-name">{enq.name}</div>
                      <a href={`tel:${enq.phone}`} className="mobile-inquiry-phone" title="Tap to call">
                        <Phone size={12} />
                        <span>{enq.phone}</span>
                      </a>
                    </div>
                    <span className={`pill pill-${enq.status.toLowerCase()}`}>
                      {enq.status}
                    </span>
                  </div>

                  <div className="mobile-inquiry-course">
                    🎯 <span>{enq.courseInterested}</span>
                  </div>

                  <div className="mobile-inquiry-bottom">
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleQuickStatusChange(enq._id, e.target.value)}
                      className="mobile-status-dropdown"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#eab308" />
              <span>Active Notices & Alerts</span>
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('notices')}
            >
              <span>Manage</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {s.recentNotices.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                No active notices found.
              </div>
            ) : (
              s.recentNotices.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#eab308', fontWeight: '600', textTransform: 'uppercase' }}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{n.date}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                    {n.title}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick links banner */}
          <div className="dashboard-quick-banner">
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#4ade80' }}>
                Academy Quick Actions
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Update batch dates or publish defense tips
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('courses')}
              style={{ flexShrink: 0 }}
            >
              Add Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
