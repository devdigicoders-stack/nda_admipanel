import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, ZoomIn, ExternalLink } from 'lucide-react';
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

  const [previewPhoto, setPreviewPhoto] = useState(null);

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
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
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
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
              {/* Thumbnail Container */}
              <div 
                style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', cursor: 'pointer', backgroundColor: '#0b0f17' }}
                onClick={() => setPreviewPhoto(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Category pill below thumbnail */}
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}>
                  {item.category}
                </span>
              </div>

              <div style={{ flex: 1, marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#f8fafc', marginBottom: '4px' }}>
                  {item.title}
                </div>
                {item.caption && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                    {item.caption}
                  </div>
                )}
              </div>

              {/* Action Buttons: Full View Modal, Delete */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '12px', gap: '6px' }}
                  onClick={() => setPreviewPhoto(item)}
                  title="Full View in Popup Modal"
                >
                  <ZoomIn size={14} />
                  <span>Full View</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '6px 10px' }}
                  onClick={() => handleDelete(item._id, item.title)}
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full View Lightbox Modal in Admin Panel */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '850px',
              width: '100%',
              backgroundColor: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            {/* FULL UNCUT PHOTO CONTAINER */}
            <div style={{ maxHeight: '520px', backgroundColor: '#070a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ padding: '20px' }}>
              <span style={{
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {previewPhoto.category}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', marginTop: '10px', marginBottom: '6px' }}>
                {previewPhoto.title}
              </h3>
              {previewPhoto.caption && (
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {previewPhoto.caption}
                </p>
              )}
            </div>
          </div>
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
