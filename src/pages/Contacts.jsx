import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Phone, 
  Mail, 
  BookOpen, 
  Eye, 
  Trash2, 
  X, 
  CheckCircle, 
  MessageSquare,
  Clock,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.getContacts(activeStatus);
      if (res.success) {
        setContacts(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      alert('Error fetching contact messages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [activeStatus]);

  const openDetail = (contact) => {
    setSelectedContact(contact);
    setEditStatus(contact.status || 'Pending');
    setEditNotes(contact.adminNotes || '');
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedContact) return;
    setUpdating(true);
    try {
      await api.updateContact(selectedContact._id, {
        status: editStatus,
        adminNotes: editNotes
      });
      setModalOpen(false);
      fetchContacts();
    } catch (err) {
      alert('Error updating contact inquiry: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete message from "${name}"?`)) {
      try {
        await api.deleteContact(id);
        fetchContacts();
      } catch (err) {
        alert('Error deleting message: ' + err.message);
      }
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.course?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return 'pill pill-enrolled';
    if (s === 'contacted') return 'pill pill-contacted';
    if (s === 'closed') return 'pill pill-closed';
    return 'pill pill-pending';
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Contact Us &amp; Website Inquiries
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Live messages and course queries submitted from the website Contact page (/contact)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Total Received: <strong style={{ color: '#38bdf8' }}>{contacts.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {['All', 'Pending', 'Contacted', 'Resolved', 'Closed'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${activeStatus === status ? 'active' : ''}`}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, phone, course, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px', width: '100%' }}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sender / Cadet</th>
              <th>Selected Course</th>
              <th>Message Snippet</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  Loading contact messages...
                </td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No contact messages found for "{activeStatus}".
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  {/* Sender Info */}
                  <td>
                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{contact.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <a 
                        href={`tel:${contact.phone}`} 
                        style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={12} /> {contact.phone}
                      </a>
                      <span>&bull;</span>
                      <a 
                        href={`mailto:${contact.email}`} 
                        style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Mail size={12} /> {contact.email}
                      </a>
                    </div>
                  </td>

                  {/* Course Interested */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>
                        {contact.course || 'General Enquiry'}
                      </span>
                    </div>
                  </td>

                  {/* Message Preview */}
                  <td style={{ maxWidth: '240px' }}>
                    {contact.message ? (
                      <span 
                        style={{ 
                          fontSize: '12px', 
                          color: '#94a3b8', 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden', 
                          lineHeight: '1.4' 
                        }}
                        title={contact.message}
                      >
                        {contact.message}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                        (No message text)
                      </span>
                    )}
                  </td>

                  {/* Status Pill */}
                  <td>
                    <span className={getStatusBadgeClass(contact.status)}>
                      {contact.status || 'Pending'}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </td>

                  {/* Action Buttons */}
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openDetail(contact)}
                        title="View Full Message & Update Status"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(contact._id, contact.name)}
                        title="Delete Message"
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

      {/* Detail & Follow-up Modal */}
      {modalOpen && selectedContact && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  Contact Message Details
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                {/* Contact Information Card */}
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  border: '1px solid var(--border-color)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                        {selectedContact.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        Submitted on: {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString('en-IN') : 'N/A'}
                      </div>
                    </div>
                    <span className={getStatusBadgeClass(selectedContact.status)}>
                      {selectedContact.status || 'Pending'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#cbd5e1' }}>
                    <div>
                      📞 <strong>Phone:</strong>{' '}
                      <a href={`tel:${selectedContact.phone}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                        {selectedContact.phone}
                      </a>
                    </div>
                    <div>
                      ✉️ <strong>Email:</strong>{' '}
                      <a href={`mailto:${selectedContact.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                        {selectedContact.email}
                      </a>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      🎯 <strong>Course Inquired:</strong>{' '}
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>{selectedContact.course}</span>
                    </div>
                  </div>

                  {/* Message Callout */}
                  <div style={{ marginTop: '14px', borderTop: '1px dashed #334155', paddingTop: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      💬 Message from Candidate:
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.08)',
                      borderLeft: '3px solid #38bdf8',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#f1f5f9',
                      lineHeight: '1.6'
                    }}>
                      {selectedContact.message || 'No additional message was provided by the user.'}
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="form-group">
                  <label>Update Query Status *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Pending">Pending (Not yet contacted)</option>
                    <option value="Contacted">Contacted (Counselor called cadet/parent)</option>
                    <option value="Resolved">Resolved (Query answered / brochure sent)</option>
                    <option value="Closed">Closed (Archived)</option>
                  </select>
                </div>

                {/* Counselor Notes */}
                <div className="form-group">
                  <label>Academy Counselor Notes</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter counselor notes (e.g., student asked about hostel fee, sent syllabus on WhatsApp, scheduled campus visit)..."
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
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Status & Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
