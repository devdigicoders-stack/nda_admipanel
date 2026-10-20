import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  User, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  Globe,
  Clock,
  Tag,
  ShieldCheck,
  Save,
  Check,
  Link2,
  Copy,
  RefreshCw,
  X
} from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { api } from '../api';
import ImageUploadInput from '../components/ImageUploadInput';

// Helper function to generate clean SEO slug from text
const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor'
  const [editingBlog, setEditingBlog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    isSlugCustomized: false,
    category: 'SSB Interview Guide',
    summary: '',
    content: '',
    authorName: 'Col. Rajesh Sharma (Retd.)',
    authorDesignation: 'Chief SSB Mentor',
    readTime: '6 min read',
    tags: ['SSB Interview', 'Screening', 'NDA 2026'],
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.getBlogs();
      if (res.success) {
        setBlogs(res.data || []);
      }
    } catch (err) {
      alert('Error fetching blogs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddPage = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      isSlugCustomized: false,
      category: 'SSB Interview Guide',
      summary: '',
      content: '',
      authorName: 'Col. Rajesh Sharma (Retd.)',
      authorDesignation: 'Chief SSB Mentor',
      readTime: '5 min read',
      tags: ['SSB Interview', 'Screening', 'NDA 2026'],
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      isPublished: true
    });
    setTagInput('');
    setCopiedLink(false);
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditPage = (blog) => {
    setEditingBlog(blog);
    const blogTags = Array.isArray(blog.tags) 
      ? blog.tags 
      : (typeof blog.tags === 'string' ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    setFormData({
      title: blog.title || '',
      slug: blog.slug || generateSlug(blog.title || ''),
      isSlugCustomized: true,
      category: blog.category || 'SSB Interview Guide',
      summary: blog.summary || '',
      content: blog.content || '',
      authorName: blog.author?.name || 'Col. Rajesh Sharma (Retd.)',
      authorDesignation: blog.author?.designation || 'Chief SSB Mentor',
      readTime: blog.readTime || '5 min read',
      tags: blogTags,
      coverImage: blog.coverImage || '',
      isPublished: blog.isPublished !== false
    });
    setTagInput('');
    setCopiedLink(false);
    if (editorRef.current) {
      editorRef.current.setContent(blog.content || '');
    }
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewMode('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Title change with automatic dynamic slug generation
  const handleTitleChange = (newTitle) => {
    setFormData(prev => {
      const updatedSlug = !prev.isSlugCustomized ? generateSlug(newTitle) : prev.slug;
      return { ...prev, title: newTitle, slug: updatedSlug };
    });
  };

  // Custom slug manual editing
  const handleSlugChange = (rawSlug) => {
    const cleaned = generateSlug(rawSlug);
    setFormData(prev => ({
      ...prev,
      slug: cleaned,
      isSlugCustomized: true
    }));
  };

  // Re-sync slug with title
  const handleSyncSlugWithTitle = () => {
    const freshSlug = generateSlug(formData.title);
    setFormData(prev => ({
      ...prev,
      slug: freshSlug,
      isSlugCustomized: false
    }));
  };

  // Copy full live link
  const handleCopyLink = () => {
    const fullUrl = `http://localhost:3000/blogs/${formData.slug || generateSlug(formData.title) || 'preview'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Tags management
  const handleAddTag = (rawTag) => {
    if (!rawTag) return;
    const cleanTag = rawTag.trim().replace(/^#/, '');
    if (!cleanTag) return;

    if (!formData.tags.includes(cleanTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, cleanTag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an Article Title');
      return;
    }
    if (!formData.summary.trim()) {
      alert('Please enter an Executive Summary');
      return;
    }

    setSaving(true);
    try {
      const finalSlug = formData.slug.trim() || generateSlug(formData.title.trim()) || 'article-' + Date.now();
      const currentContent = editorRef.current ? editorRef.current.getContent() : formData.content;

      const payload = {
        title: formData.title.trim(),
        slug: finalSlug,
        category: formData.category,
        summary: formData.summary.trim(),
        content: currentContent,
        author: {
          name: formData.authorName.trim(),
          designation: formData.authorDesignation.trim()
        },
        readTime: formData.readTime.trim(),
        tags: formData.tags || [],
        coverImage: formData.coverImage,
        isPublished: formData.isPublished
      };

      if (editingBlog) {
        await api.updateBlog(editingBlog._id, payload);
      } else {
        await api.createBlog(payload);
      }

      setViewMode('list');
      fetchBlogs();
    } catch (err) {
      alert('Error saving blog article: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete article: "${title}"?`)) {
      try {
        await api.deleteBlog(id);
        fetchBlogs();
      } catch (err) {
        alert('Error deleting blog: ' + err.message);
      }
    }
  };

  // ==========================================
  // VIEW 1: FULL-PAGE BLOG EDITOR
  // ==========================================
  if (viewMode === 'editor') {
    return (
      <div style={{ paddingBottom: '60px' }}>
        {/* Top Sticky Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackToList}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Articles</span>
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Defense Blogs /</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#eab308' }}>
                  {editingBlog ? 'Edit Article' : 'Write New Article'}
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc', marginTop: '2px', marginBottom: 0 }}>
                {formData.title || 'Untitled Defense Article'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackToList}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
              style={{ minWidth: '160px' }}
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Editor Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: Main Writing Space (Title, Dynamic URL, Summary, TinyMCE Editor) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Title & Dynamic URL Permalink Card */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
                  Article Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Cracking PPDT in SSB: How to Write Convincing Stories & Lead the GD"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    padding: '12px 16px',
                    backgroundColor: '#0b0f17',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
              </div>

              {/* DYNAMIC URL & PERMALINK SECTION */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '8px',
                backgroundColor: '#0b0f17',
                border: '1px solid #334155',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                    <Link2 size={15} />
                    <span>Dynamic URL Slug (Permalink)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={handleSyncSlugWithTitle}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#eab308',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                      title="Auto-generate slug from current Title"
                    >
                      <RefreshCw size={12} />
                      <span>Sync with Title</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedLink ? '#4ade80' : '#94a3b8',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', background: '#161f30', borderRadius: '6px', border: '1px solid #334155', overflow: 'hidden' }}>
                  <span style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid #334155', whiteSpace: 'nowrap' }}>
                    /blogs/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="your-custom-article-slug"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#facc15',
                      fontWeight: '600',
                      width: '100%'
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Live Article URL: <span style={{ color: '#38bdf8' }}>http://localhost:3000/blogs/{formData.slug || 'your-slug'}</span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Executive Summary (Short Card Preview) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="2-3 sentence overview that appears on the website cards and search engine results..."
                  style={{
                    fontSize: '14px',
                    padding: '12px 14px',
                    backgroundColor: '#0b0f17',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>

            {/* TinyMCE Rich Text Editor Card */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#eab308" />
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
                    Full Article Content (TinyMCE Rich Text Editor)
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Format text, add headings, lists, tables, links &amp; quotes
                </span>
              </div>

              <Editor
                key={editingBlog ? editingBlog._id : 'new-article-editor'}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                }}
                initialValue={formData.content}
                init={{
                  license_key: 'gpl',
                  height: 540,
                  menubar: 'edit insert format table tools',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | removeformat | code fullscreen preview',
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  promotion: false,
                  branding: false,
                  content_style: 'body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; line-height: 1.6; color: #f8fafc; background-color: #0b0f17; padding: 18px; } p { margin: 0 0 6px 0; line-height: 1.6; } h2, h3, h4 { color: #facc15; font-weight: 700; margin-top: 18px; margin-bottom: 8px; } a { color: #38bdf8; text-decoration: underline; } blockquote { border-left: 3px solid #facc15; padding-left: 14px; margin: 12px 0; color: #94a3b8; font-style: italic; } code { background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace; } table { border-collapse: collapse; width: 100%; margin: 16px 0; } th, td { border: 1px solid #334155; padding: 8px 12px; text-align: left; } th { background-color: #1e293b; color: #eab308; } ul, ol { padding-left: 26px; margin: 8px 0; }',
                  placeholder: 'Start typing your defense article guidance, screening tips, and steps here...'
                }}
              />
            </div>

            {/* Bottom Save Action Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              backgroundColor: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Ready to publish? Review your Dynamic URL, Tags, and content before saving.
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBackToList}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={saving}
                  style={{ minWidth: '150px' }}
                >
                  <Save size={16} />
                  <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Settings, Dynamic Tags & Metadata Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. Publishing & Status Card */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={15} />
                <span>Publishing Status</span>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ backgroundColor: '#0b0f17' }}
                >
                  <option value="SSB Interview Guide">SSB Interview Guide</option>
                  <option value="NDA Written Strategy">NDA Written Strategy</option>
                  <option value="Physical & Medical">Physical & Medical</option>
                  <option value="Current Affairs & Defense">Current Affairs & Defense</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g. 5 min read"
                  style={{ backgroundColor: '#0b0f17' }}
                />
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginTop: '12px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: '700', fontSize: '13px' }}>
                      Publish Immediately
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '1px' }}>
                      Visible to cadets on website (/blogs)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. DYNAMIC TAGS MANAGEMENT CARD */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={15} />
                  <span>Dynamic Tags ({formData.tags?.length || 0})</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Search &amp; Filters</span>
              </div>

              {/* Tag Input Field */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Type tag & press Enter..."
                  style={{
                    backgroundColor: '#0b0f17',
                    fontSize: '13px',
                    padding: '8px 12px'
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddTag(tagInput)}
                  style={{ flexShrink: 0 }}
                  title="Add Tag"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Tags Badge List */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '36px', marginBottom: '16px' }}>
                {formData.tags && formData.tags.length > 0 ? (
                  formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          padding: '0 2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={`Remove "${tag}"`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                    No tags added yet. Choose from suggestions below.
                  </span>
                )}
              </div>

              {/* Quick Tag Suggestions */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Popular Suggestions (Click to Add):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'SSB Interview',
                    'NDA Written 2026',
                    'PPDT & Screening',
                    'Group Discussion',
                    'Psychology Test',
                    'GTO Ground Tasks',
                    'Current Affairs',
                    'Medical Standards',
                    'CDS / AFCAT'
                  ].map((preset) => {
                    const alreadyAdded = formData.tags?.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddTag(preset)}
                        disabled={alreadyAdded}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: alreadyAdded ? 'rgba(255,255,255,0.03)' : 'rgba(234, 179, 8, 0.1)',
                          border: '1px solid',
                          borderColor: alreadyAdded ? '#334155' : 'rgba(234, 179, 8, 0.25)',
                          color: alreadyAdded ? '#64748b' : '#facc15',
                          cursor: alreadyAdded ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {alreadyAdded ? '✓ ' : '+ '}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Cover Image Card */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <ImageUploadInput
                label="Article Cover Photo (Upload or URL)"
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                placeholder="Upload photo or paste URL..."
              />
            </div>

            {/* 4. Author Credentials Card */}
            <div style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} />
                <span>Author &amp; Faculty Mentor</span>
              </div>

              <div className="form-group">
                <label>Officer / Author Name</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g. Col. Rajesh Sharma (Retd.)"
                  style={{ backgroundColor: '#0b0f17' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Designation / Former Rank</label>
                <input
                  type="text"
                  value={formData.authorDesignation}
                  onChange={(e) => setFormData({ ...formData, authorDesignation: e.target.value })}
                  placeholder="e.g. Ex-President 11 SSB Allahabad"
                  style={{ backgroundColor: '#0b0f17' }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ARTICLE LISTING PAGE
  // ==========================================
  return (
    <div>
      {/* Header bar with "+ Write Article" button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
            Defense Articles &amp; SSB Prep Guides
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Publish tactical preparation tips, current affairs notes, and officer guidance
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddPage}>
          <Plus size={16} />
          <span>Write Article</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#161f30',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '14px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
            No defense articles published yet
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            Click below to create your first article with rich text formatting, headings, and images.
          </p>
          <button className="btn btn-primary" onClick={openAddPage}>
            <Plus size={16} />
            <span>Write First Article</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {blogs.map((b) => (
            <div key={b._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', position: 'relative' }}>
                <img
                  src={b.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                  alt={b.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#eab308',
                  fontWeight: '700'
                }}>
                  {b.category}
                </span>

                {b.isPublished === false && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.85)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#ffffff',
                    fontWeight: '700'
                  }}>
                    Draft
                  </span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>{b.title}</h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '10px', maxHeight: '54px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.summary}
                </p>

                {/* Display tags preview on cards */}
                {b.tags && Array.isArray(b.tags) && b.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {b.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                    {b.tags.length > 3 && (
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        +{b.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <User size={12} color="#eab308" />
                  <span>{b.author?.name || 'Academy Mentor'}</span>
                  <span>&bull;</span>
                  <span>{b.readTime || '5 min read'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openEditPage(b)}
                >
                  <Edit2 size={14} />
                  <span>Edit Article</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(b._id, b.title)}
                  title="Delete Article"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
