import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Image as ImageIcon, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { api } from '../api';

export default function FileUploadInput({
  label = 'Attached Document / Circular (PDF, Image, or URL)',
  value = '',
  onChange,
  placeholder = 'https://upsc.gov.in or upload circular PDF/Image'
}) {
  const [mode, setMode] = useState('local'); // 'local' | 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const isPdf = typeof value === 'string' && (value.toLowerCase().includes('.pdf') || value.toLowerCase().endsWith('.pdf'));
  const isImage = typeof value === 'string' && (
    value.toLowerCase().endsWith('.jpg') ||
    value.toLowerCase().endsWith('.jpeg') ||
    value.toLowerCase().endsWith('.png') ||
    value.toLowerCase().endsWith('.webp') ||
    value.toLowerCase().endsWith('.gif') ||
    value.includes('unsplash.com') ||
    value.includes('images')
  );

  const handleFileSelect = async (file) => {
    if (!file) return;

    const isAllowed = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') || file.type.startsWith('image/');
    if (!isAllowed) {
      setUploadError('Please select a valid PDF document or Image file (JPG, PNG, WEBP).');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload file. Make sure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', margin: 0 }}>
          {label}
        </label>

        {/* Toggle between Local Upload and Link URL */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0f172a',
          borderRadius: '6px',
          padding: '2px',
          border: '1px solid #243046'
        }}>
          <button
            type="button"
            onClick={() => { setMode('local'); setUploadError(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: mode === 'local' ? '#eab308' : 'transparent',
              color: mode === 'local' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Upload size={12} />
            <span>Upload PDF / Image</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('url'); setUploadError(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: mode === 'url' ? '#eab308' : 'transparent',
              color: mode === 'url' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <LinkIcon size={12} />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {mode === 'local' ? (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? '#eab308' : '#334155'}`,
              backgroundColor: dragOver ? 'rgba(234, 179, 8, 0.05)' : '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf,image/*,.jpg,.jpeg,.png,.webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ color: '#eab308', fontSize: '13px', fontWeight: '600' }}>
                  ⏳ Uploading file to server...
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Please wait a moment</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#eab308'
                }}>
                  <Upload size={18} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                  Click to select or drag & drop PDF or Image
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Official circulars, exam schedule PDF or image (Max 25MB)
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Attached File Preview Card */}
      {value && (
        <div style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#0f172a',
          border: '1px solid #243046',
          borderRadius: '8px',
          padding: '8px 12px'
        }}>
          {isImage ? (
            <img
              src={value}
              alt="Preview"
              onError={(e) => { e.target.style.display = 'none'; }}
              style={{
                width: '46px',
                height: '42px',
                borderRadius: '6px',
                objectFit: 'cover',
                border: '1px solid #334155',
                flexShrink: 0
              }}
            />
          ) : isPdf ? (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              flexShrink: 0
            }}>
              <FileText size={20} />
            </div>
          ) : (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              flexShrink: 0
            }}>
              <LinkIcon size={20} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: isPdf ? '#ef4444' : isImage ? '#10b981' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={12} />
              <span>{isPdf ? 'PDF Document Attached' : isImage ? 'Image Attached' : 'Web Link Attached'}</span>
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {value}
            </div>
          </div>

          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="Open / View Attachment"
            style={{
              color: '#eab308',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={() => onChange('')}
            title="Remove attachment"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
