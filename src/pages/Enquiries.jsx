import React, { useEffect, useState } from 'react';
import { Search, Phone, Mail, MapPin, Eye, Trash2, X, CheckCircle, MessageSquare } from 'lucide-react';
import { api } from '../api';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getEnquiries(activeStatus);
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      alert('Error fetching enquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [activeStatus]);

  const openDetail = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.adminNotes || '');
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      await api.updateEnquiry(selectedEnquiry._id, {
        status: editStatus,
        adminNotes: editNotes
      });
      setModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      alert('Error updating enquiry: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      try {
        await api.deleteEnquiry(id);
        fetchEnquiries();
      } catch (err) {
        alert('Error deleting enquiry: ' + err.message);
      }
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.courseInterested?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Admission Leads & Student Inquiries
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Real-time enquiries submitted from the NDA & SSB website contact and enrollment forms
          </p>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {['All', 'Pending', 'Contacted', 'Enrolled', 'Closed'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${activeStatus === status ? 'active' : ''}`}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search candidate name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Target Course</th>
              <th>City / Location</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  Loading admission enquiries...
                </td>
              </tr>
            ) : filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No enquiries matching this criteria.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enq) => (
                <tr key={enq._id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{enq.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {enq.phone}
                      </span>
                      <span>&bull;</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={11} /> {enq.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                      {enq.courseInterested}
                    </span>
                    {enq.qualification && (
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Edu: {enq.qualification}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {enq.city || 'Not specified'}
                  </td>
                  <td>
                    <span className={`pill pill-${(enq.status || 'pending').toLowerCase()}`}>
                      {enq.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openDetail(enq)}
                        title="View / Update Enquiry"
                      >
                        <Eye size={14} />
                        <span>Manage</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(enq._id, enq.name)}
                        title="Delete Lead"
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

      {/* Detail / Update Status Modal */}
      {modalOpen && selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                Candidate Admission Dossier
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                {/* Candidate Info Card */}
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  border: '1px solid var(--border-color)',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
                    {selectedEnquiry.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                    <div>📞 <strong>Phone:</strong> {selectedEnquiry.phone}</div>
                    <div>✉️ <strong>Email:</strong> {selectedEnquiry.email}</div>
                    <div>🎯 <strong>Course:</strong> {selectedEnquiry.courseInterested}</div>
                    <div>📍 <strong>City:</strong> {selectedEnquiry.city || 'N/A'}</div>
                    <div>🎓 <strong>Qualification:</strong> {selectedEnquiry.qualification || 'N/A'}</div>
                    <div>📅 <strong>Target Year:</strong> {selectedEnquiry.targetExamYear || '2026'}</div>
                  </div>

                  {selectedEnquiry.message && (
                    <div style={{ marginTop: '12px', borderTop: '1px dashed #334155', paddingTop: '10px', fontSize: '13px', color: '#94a3b8' }}>
                      <strong style={{ color: '#eab308' }}>Candidate Message:</strong> "{selectedEnquiry.message}"
                    </div>
                  )}
                </div>

                {/* Status selector */}
                <div className="form-group">
                  <label>Update Lead Status *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Pending">Pending (Not yet called)</option>
                    <option value="Contacted">Contacted (Counselor spoke with candidate)</option>
                    <option value="Enrolled">Enrolled (Seat booked & registered)</option>
                    <option value="Closed">Closed (Not interested / archived)</option>
                  </select>
                </div>

                {/* Counselor Notes */}
                <div className="form-group">
                  <label>Counselor / Officer Notes</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter discussion notes, scheduled call-back, batch preference, fee discussion..."
                  />
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
                  Save Status & Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
