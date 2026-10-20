import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      if (data.success && data.token) {
        api.setToken(data.token);
        api.setAdmin(data.admin);
        onLoginSuccess(data.admin);
      } else {
        setError(data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Server error. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0b0f17 100%)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#161f30',
        border: '1px solid #243046',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #ca8a04, #eab308)',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(234, 179, 8, 0.35)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={36} color="#0B0F17" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc' }}>
            Command Control Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
            Shaurya NDA & SSB Academy Administration
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#94a3b8" />
              <span>Officer / Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@ndassb.academy"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#94a3b8" />
              <span>Security Key / Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating Officer...' : (
              <>
                <span>Access Command Center</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
