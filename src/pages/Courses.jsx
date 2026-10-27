import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, GraduationCap, Eye } from 'lucide-react';
import { api } from '../api';
import ImageUploadInput from '../components/ImageUploadInput';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: 'Offline Mode SSB',
    duration: '',
    fees: '',
    batchStartDate: '',
    timings: '08:30 AM - 02:30 PM',
    badge: 'Popular',
    description: '',
    highlights: '',
    image: '',
    isActive: true
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses();
      if (res.success) {
        setCourses(res.data);
      }
    } catch (err) {
      alert('Error fetching courses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      code: 'COURSE-' + Math.floor(1000 + Math.random() * 9000),
      category: 'Offline Mode SSB',
      duration: '10-Day Intensive',
      fees: '25000',
      batchStartDate: 'Starts 1st & 15th of every month',
      timings: '08:30 AM - 02:30 PM',
      badge: 'Popular',
      description: '',
      highlights: 'Daily 6-hour classes\nWeekly OMR tests\nHostel facility',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      code: course.code || '',
      category: course.category || 'NDA Written',
      duration: course.duration || '',
      fees: course.fees?.toString() || '',
      batchStartDate: course.batchStartDate || '',
      timings: course.timings || '',
      badge: course.badge || '',
      description: course.description || '',
      highlights: Array.isArray(course.highlights)
        ? course.highlights.join('\n')
        : typeof course.highlights === 'string'
          ? course.highlights
          : '',
      image: course.image || '',
      isActive: course.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        fees: Number(formData.fees),
        highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean)
      };

      if (editingCourse) {
        await api.updateCourse(editingCourse._id, payload);
      } else {
        await api.createCourse(payload);
      }

      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      alert('Error saving course: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete course: "${title}"?`)) {
      try {
        await api.deleteCourse(id);
        fetchCourses();
      } catch (err) {
        alert('Error deleting course: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>NDA &amp; SSB Course Catalog</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Manage course fees, durations, batch schedules and syllabus details</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'Offline Mode SSB', 'Online Mode SSB', 'NDA & CDS Written'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: selectedCategory === cat ? '1px solid #eab308' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === cat ? 'rgba(234, 179, 8, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              color: selectedCategory === cat ? '#eab308' : '#94a3b8',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading courses...</div>
      ) : (
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {courses
            .filter((c) => selectedCategory === 'All' || c.category === selectedCategory)
            .map((c) => (
            <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Clean Thumbnail without clutter overlay */}
              <div style={{ position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                <img
                  src={c.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'}
                  alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Badges placed neatly below thumbnail */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {c.category}
                </span>
                {c.badge && (
                  <span style={{
                    backgroundColor: 'rgba(16, 156, 217, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {c.badge}
                  </span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>{c.title}</h3>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>⏳ <strong>{c.duration}</strong></span>
                  <span>💰 <strong>₹{c.fees?.toLocaleString('en-IN')}</strong></span>
                </div>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '14px', maxHeight: '56px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.description}
                </p>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                  📅 Next batch: <span style={{ color: '#eab308' }}>{c.batchStartDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setViewingCourse(c)}
                  className="btn btn-secondary btn-sm"
                  title="View Course Details"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openEditModal(c)}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c._id, c.title)}
                  title="Delete Course"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                {editingCourse ? 'Edit Defense Course' : 'Create New Course'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. SSB 14-Days Comprehensive Interview Bootcamp"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Offline Mode SSB">Offline Mode SSB (10-Day)</option>
                      <option value="Online Mode SSB">Online Mode SSB (20-Day)</option>
                      <option value="NDA & CDS Written">NDA &amp; CDS Written</option>
                      <option value="NDA Written">NDA Written (Legacy)</option>
                      <option value="SSB 14 Days Training">SSB 14 Days Training (Legacy)</option>
                      <option value="CDS / AFCAT">CDS / AFCAT</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Course Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. SSB-14D-2026"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Duration *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 14 Days Residential"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fees (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.fees}
                      onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                      placeholder="e.g. 24500"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Batch Start Date</label>
                    <input
                      type="text"
                      value={formData.batchStartDate}
                      onChange={(e) => setFormData({ ...formData, batchStartDate: e.target.value })}
                      placeholder="e.g. Batches every Monday"
                    />
                  </div>

                  <div className="form-group">
                    <label>Badge / Highlight</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Ex-SSB Assessors"
                    />
                  </div>
                </div>

                <ImageUploadInput
                  label="Course Cover Image (Upload or URL)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="https://images.unsplash.com/... or upload local image"
                />

                <div className="form-group">
                  <label>Course Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed explanation of the course training approach..."
                  />
                </div>

                <div className="form-group">
                  <label>Key Highlights (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="OIR & PPDT Screening Mastery&#10;Outdoor GTO Obstacles Ground&#10;1-on-1 Mock Interview with Ex-IO"
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
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Course Details View Modal */}
      {viewingCourse && (
        <div className="modal-overlay" onClick={() => setViewingCourse(null)}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                  Course Details
                </h3>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                  {viewingCourse.code} &bull; {viewingCourse.category}
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingCourse(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
              {viewingCourse.image && (
                <div style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a',
                  marginBottom: '18px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={viewingCourse.image}
                    alt={viewingCourse.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {viewingCourse.title}
                </h2>
                {viewingCourse.badge && (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    color: '#eab308',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    whiteSpace: 'nowrap'
                  }}>
                    {viewingCourse.badge}
                  </span>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '10px',
                padding: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                marginBottom: '18px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Course Fees</span>
                  <strong style={{ color: '#22c55e', fontSize: '15px' }}>₹{viewingCourse.fees?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Duration</span>
                  <strong style={{ color: '#f8fafc' }}>{viewingCourse.duration}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Daily Timings</span>
                  <strong style={{ color: '#f8fafc' }}>{viewingCourse.timings || '08:30 AM - 02:30 PM'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Batch Start</span>
                  <strong style={{ color: '#eab308' }}>{viewingCourse.batchStartDate || 'Contact Office'}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Description
                </h4>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {viewingCourse.description}
                </p>
              </div>

              {viewingCourse.highlights && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Key Highlights
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(Array.isArray(viewingCourse.highlights)
                      ? viewingCourse.highlights
                      : typeof viewingCourse.highlights === 'string'
                        ? viewingCourse.highlights.split('\n')
                        : []
                    ).filter(Boolean).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingCourse(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const toEdit = viewingCourse;
                  setViewingCourse(null);
                  openEditModal(toEdit);
                }}
              >
                <Edit2 size={14} />
                <span>Edit This Course</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
