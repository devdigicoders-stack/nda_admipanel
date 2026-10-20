import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, GraduationCap } from 'lucide-react';
import { api } from '../api';
import ImageUploadInput from '../components/ImageUploadInput';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: 'NDA Written',
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
      category: 'NDA Written',
      duration: '6 Months',
      fees: '35000',
      batchStartDate: 'Starts 1st of every month',
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
      highlights: Array.isArray(course.highlights) ? course.highlights.join('\n') : '',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>NDA & SSB Course Catalog</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Manage course fees, durations, batch schedules and syllabus details</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add New Course</span>
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading courses...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {courses.map((c) => (
            <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
                <img
                  src={c.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'}
                  alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.3)'
                }}>
                  {c.category}
                </div>
                {c.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(21, 128, 61, 0.9)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {c.badge}
                  </div>
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
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openEditModal(c)}
                >
                  <Edit2 size={14} />
                  <span>Edit Course</span>
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

            <form onSubmit={handleSubmit}>
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
                      <option value="NDA Written">NDA Written</option>
                      <option value="SSB 14 Days Training">SSB 14 Days Training</option>
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
    </div>
  );
}
