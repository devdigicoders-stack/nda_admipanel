const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = {
  getToken() {
    return localStorage.getItem('ndassb_admin_token') || '';
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('ndassb_admin_token', token);
    } else {
      localStorage.removeItem('ndassb_admin_token');
    }
  },

  getAdmin() {
    try {
      const data = localStorage.getItem('ndassb_admin_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setAdmin(user) {
    if (user) {
      localStorage.setItem('ndassb_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ndassb_admin_user');
    }
  },

  logout() {
    localStorage.removeItem('ndassb_admin_token');
    localStorage.removeItem('ndassb_admin_user');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          this.logout();
        }
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  },

  getMe() {
    return this.request('/auth/me');
  },

  // Dashboard Stats
  getDashboardStats() {
    return this.request('/dashboard/stats');
  },

  // Courses
  getCourses() {
    return this.request('/courses');
  },
  createCourse(course) {
    return this.request('/courses', { method: 'POST', body: course });
  },
  updateCourse(id, course) {
    return this.request(`/courses/${id}`, { method: 'PUT', body: course });
  },
  deleteCourse(id) {
    return this.request(`/courses/${id}`, { method: 'DELETE' });
  },

  // Enquiries
  getEnquiries(status = 'All', course = 'All') {
    return this.request(`/enquiries?status=${encodeURIComponent(status)}&course=${encodeURIComponent(course)}`);
  },
  updateEnquiry(id, data) {
    return this.request(`/enquiries/${id}`, { method: 'PUT', body: data });
  },
  deleteEnquiry(id) {
    return this.request(`/enquiries/${id}`, { method: 'DELETE' });
  },

  // Contact Us Queries
  getContacts(status = 'All', course = 'All') {
    return this.request(`/contact?status=${encodeURIComponent(status)}&course=${encodeURIComponent(course)}`);
  },
  updateContact(id, data) {
    return this.request(`/contact/${id}`, { method: 'PUT', body: data });
  },
  deleteContact(id) {
    return this.request(`/contact/${id}`, { method: 'DELETE' });
  },

  // Notices
  getNotices() {
    return this.request('/notices/admin');
  },
  createNotice(notice) {
    return this.request('/notices', { method: 'POST', body: notice });
  },
  updateNotice(id, notice) {
    return this.request(`/notices/${id}`, { method: 'PUT', body: notice });
  },
  deleteNotice(id) {
    return this.request(`/notices/${id}`, { method: 'DELETE' });
  },

  // Blogs
  getBlogs() {
    return this.request('/blogs/admin');
  },
  createBlog(blog) {
    return this.request('/blogs', { method: 'POST', body: blog });
  },
  updateBlog(id, blog) {
    return this.request(`/blogs/${id}`, { method: 'PUT', body: blog });
  },
  deleteBlog(id) {
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  },

  // Gallery
  getGallery(category = 'All') {
    return this.request(`/gallery?category=${encodeURIComponent(category)}`);
  },
  createGalleryItem(item) {
    return this.request('/gallery', { method: 'POST', body: item });
  },
  deleteGalleryItem(id) {
    return this.request(`/gallery/${id}`, { method: 'DELETE' });
  },

  // File Upload (Local file to server: Images or PDFs)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = this.getToken();
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'File upload failed');
    }
    return data;
  },
  uploadImage(file) {
    return this.uploadFile(file);
  }
};

