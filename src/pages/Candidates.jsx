import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Award, ZoomIn, Upload } from 'lucide-react';
import { api } from '../api';
import ImageUploadInput from '../components/ImageUploadInput';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.getCandidates();
      if (res.success) {
        setCandidates(res.data);
      }
    } catch (err) {
      alert('Error fetching candidates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const openAddModal = () => {
    setPhotoUrl('');
    setName('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) {
      alert('Please upload or provide candidate image URL.');
      return;
    }
    try {
      await api.createCandidate({ photoUrl, name });
      setModalOpen(false);
      setPhotoUrl('');
      setName('');
      fetchCandidates();
    } catch (err) {
      alert('Error uploading candidate photo: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this selected candidate poster?')) {
      try {
        await api.deleteCandidate(id);
        fetchCandidates();
      } catch (err) {
        alert('Error deleting: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Our Selected Cadets (Photo / Posters)
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Upload selected candidate posters &amp; photos. They will slide automatically on the homepage.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAddModal}>
          <Plus size={16} />
          <span>Upload Candidate Photo</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading candidates...</div>
      ) : candidates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
          <Award size={48} color="#eab308" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ color: '#f8fafc', marginBottom: '6px' }}>No Selected Cadets Uploaded Yet</h3>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>Upload your first selected candidate photo or banner poster.</p>
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <Plus size={16} />
            <span>Upload Candidate Photo</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
          {candidates.map((cadet) => (
            <div key={cadet._id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{ position: 'relative', height: '240px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#070a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setPreviewPhoto(cadet.photoUrl)}
              >
                <img
                  src={cadet.photoUrl}
                  alt={cadet.name || 'Candidate'}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cadet.name || 'Selected Candidate'}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cadet._id)}
                  title="Delete Photo"
                  style={{ padding: '4px 8px' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                Upload Selected Candidate Photo
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
                <ImageUploadInput
                  label="Candidate Photo / Banner Poster *"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  placeholder="Upload candidate poster photo or paste URL"
                />

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Candidate Name or Title (Optional - for your reference only)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mayank Pandey NDA-152"
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
                  Upload Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPhoto && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '750px', background: '#0b0f17' }}
          >
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                Full View
              </h3>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setPreviewPhoto(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={previewPhoto}
                alt="Full Candidate Poster"
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
