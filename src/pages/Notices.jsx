import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Bell, AlertTriangle, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';
import FileUploadInput from '../components/FileUploadInput';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'New Batch Alert',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    description: '',
    isUrgent: false,
    linkUrl: '',
    isActive: true
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.getNotices();
      if (res.success) {
        setNotices(res.data);
      }
    } catch (err) {
      alert('Error fetching notices: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      category: 'New Batch Alert',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: '',
      isUrgent: false,
      linkUrl: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || '',
      category: notice.category || 'New Batch Alert',
      date: notice.date || '',
      description: notice.description || '',
      isUrgent: !!notice.isUrgent,
      linkUrl: notice.linkUrl || '',
      isActive: notice.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await api.updateNotice(editingNotice._id, formData);
      } else {
        await api.createNotice(formData);
      }
      setModalOpen(false);
      fetchNotices();
    } catch (err) {
      alert('Error saving notice: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete notice: "${title}"?`)) {
      try {
        await api.deleteNotice(id);
        fetchNotices();
      } catch (err) {
        alert('Error deleting notice: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Academy Notices & Official Alerts
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Publish UPSC notifications, SSB batch dates, and academy alerts shown on the website
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Publish Notice</span>
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Notice Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  Loading notices...
                </td>
              </tr>
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No notices published yet.
                </td>
              </tr>
            ) : (
              notices.map((n) => (
                <tr key={n._id}>
                  <td style={{ maxWidth: '400px' }}>
                    <div style={{ fontWeight: '600', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {n.isUrgent && (
                        <span style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          URGENT
                        </span>
                      )}
                      <span>{n.title}</span>
                    </div>
                    {n.description && (
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {n.description}
                      </div>
                    )}
                    {n.linkUrl && (
                      <div style={{ marginTop: '6px' }}>
                        <a
                          href={n.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            backgroundColor: n.linkUrl.toLowerCase().includes('.pdf')
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(59, 130, 246, 0.15)',
                            color: n.linkUrl.toLowerCase().includes('.pdf') ? '#f87171' : '#60a5fa',
                            border: `1px solid ${n.linkUrl.toLowerCase().includes('.pdf') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                          }}
                        >
                          {n.linkUrl.toLowerCase().includes('.pdf') ? <FileText size={12} /> : <ExternalLink size={12} />}
                          <span>{n.linkUrl.toLowerCase().includes('.pdf') ? 'View Attached PDF' : 'View Attachment / Link'}</span>
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge-military" style={{ fontSize: '11px' }}>
                      {n.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    {n.date}
                  </td>
                  <td>
                    <span className={`pill ${n.isActive !== false ? 'pill-enrolled' : 'pill-closed'}`}>
                      {n.isActive !== false ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(n)}
                        title="Edit Notice"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(n._id, n.title)}
                        title="Delete Notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                {editingNotice ? 'Edit Academy Notice' : 'Publish New Notice'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. UPSC NDA (I) 2026 Notification Released"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Exam Notification">Exam Notification</option>
                      <option value="SSB Call Letter">SSB Call Letter</option>
                      <option value="New Batch Alert">New Batch Alert</option>
                      <option value="Academy Notice">Academy Notice</option>
                      <option value="Result">Result</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date Display *</label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g. 24 Oct 2026"
                    />
                  </div>
                </div>

                <FileUploadInput
                  label="Attach Circular Document / Image / Link"
                  value={formData.linkUrl}
                  onChange={(url) => setFormData({ ...formData, linkUrl: url })}
                  placeholder="https://upsc.gov.in or upload official PDF / Image circular"
                />

                <div className="form-group">
                  <label>Notice Summary / Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief details regarding the announcement..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
                    />
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Mark as URGENT / Flash Alert</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                    />
                    <span style={{ color: '#cbd5e1' }}>Visible on Website</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNotice ? 'Save Changes' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
