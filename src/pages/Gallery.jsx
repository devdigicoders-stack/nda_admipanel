import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';
import ImageUploadInput from '../components/ImageUploadInput';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'GTO Obstacle Ground',
    imageUrl: '',
    caption: '',
    featured: true
  });

  const categories = [
    'All',
    'GTO Obstacle Ground',
    'SSB Mock Interview',
    'Smart Classrooms',
    'Recommended Cadets',
    'Physical Training & Drill'
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.getGallery(selectedCategory);
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      alert('Error fetching gallery: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGalleryItem(formData);
      setModalOpen(false);
      setFormData({
        title: '',
        category: 'GTO Obstacle Ground',
        imageUrl: '',
        caption: '',
        featured: true
      });
      fetchGallery();
    } catch (err) {
      alert('Error adding photo: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete photo: "${title}"?`)) {
      try {
        await api.deleteGalleryItem(id);
        fetchGallery();
      } catch (err) {
        alert('Error deleting photo: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Academy Dynamic Gallery
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Add obstacle ground photos, mock interview setups, and recommended cadets
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          <span>Upload New Photo</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading gallery...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ padding: '12px' }}>
              <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  title="Delete image"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.85)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#eab308'
                }}>
                  {item.category}
                </div>
              </div>

              <div style={{ fontWeight: '600', fontSize: '14px', color: '#f8fafc', marginBottom: '4px' }}>
                {item.title}
              </div>
              {item.caption && (
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {item.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                Add Academy Photo
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
                  <label>Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Progressive Group Task (PGT) Training"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="GTO Obstacle Ground">GTO Obstacle Ground</option>
                    <option value="SSB Mock Interview">SSB Mock Interview</option>
                    <option value="Smart Classrooms">Smart Classrooms</option>
                    <option value="Recommended Cadets">Recommended Cadets</option>
                    <option value="Physical Training & Drill">Physical Training & Drill</option>
                  </select>
                </div>

                <ImageUploadInput
                  label="Academy Photo (Upload or URL) *"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="https://images.unsplash.com/... or upload local photo"
                />

                <div className="form-group">
                  <label>Caption / Details</label>
                  <textarea
                    rows={2}
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Describe what cadets are doing in this photo..."
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#eab308' }}
                  />
                  <span style={{ color: '#cbd5e1' }}>Feature on Website Homepage</span>
                </label>
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
