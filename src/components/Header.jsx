import React from 'react';
import { ExternalLink, RefreshCw, Menu } from 'lucide-react';

export default function Header({ 
  title, 
  subtitle, 
  onRefresh, 
  isRefreshing, 
  onToggleSidebar 
}) {
  return (
    <header className="admin-header">
      <div className="header-left-group">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          title="Open Menu"
          aria-label="Open Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          {subtitle && (
            <p className="header-subtitle">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="header-actions-group">
        {onRefresh && (
          <button
            type="button"
            className="btn btn-secondary btn-sm header-action-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="btn-label">Refresh</span>
          </button>
        )}

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm header-action-btn"
          style={{ textDecoration: 'none' }}
          title="Open Live Public Website"
        >
          <ExternalLink size={14} />
          <span className="btn-label">Live Site</span>
        </a>
      </div>
    </header>
  );
}
