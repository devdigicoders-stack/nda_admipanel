import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

export default function Header({ title, subtitle, onRefresh, isRefreshing }) {
  return (
    <header className="admin-header">
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onRefresh && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        )}

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <ExternalLink size={14} />
          <span>View Website</span>
        </a>
      </div>
    </header>
  );
}
