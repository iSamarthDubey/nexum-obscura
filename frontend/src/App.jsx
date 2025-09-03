import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OfficerLogin from './pages/OfficerLogin';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Visualization from './pages/Visualization';
import DemoDashboard from './pages/DemoDashboard';
import Reports from './pages/Reports';
import AlertsPanel from './components/AlertsPanel';
import './App.css';

// Navigation Component
function Navigation() {
  const location = useLocation();

  const navItems = [
    {
      path: '/oneviewlive',
      label: 'OneView - Unified',
      icon: '🚀',
      description: 'Live Unified Dashboard'
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Investigation Overview'
    },
    {
      path: '/upload',
      label: 'Upload IPDR',
      icon: '📤',
      description: 'Import Log Files'
    },
    {
      path: '/analysis',
      label: 'Analysis',
      icon: '🔍',
      description: 'Data Investigation'
    },
    {
      path: '/visualization',
      label: 'Network Map',
      icon: '🌐',
      description: 'Connection Visualization'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📋',
      description: 'Generate Evidence'
    }
  ];

  return (
    <nav className="sidebar">
      {/* Fixed Top Brand */}
      <div className="nav-logo" style={{ 
        padding: '1.5rem 1.5rem 1rem 1.5rem',
        borderBottom: '1px solid var(--cyber-border)',
        flexShrink: 0
      }}>
        <h1>NEXUM OBSCURA</h1>
        <p style={{ 
          color: 'var(--cyber-text-muted)', 
          fontSize: '0.875rem', 
          margin: '0.25rem 0 0 0',
          fontFamily: 'JetBrains Mono'
        }}>
          "Obscurity to Insight" ~ Advanced IPDR Investigation Platform.
        </p>
      </div>
      
      {/* Scrollable Middle Menu */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '1rem 0'
      }}>
        <ul className="nav-menu">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            // Unique hover effect for OneView
            const navLinkStyle = (item.path === '/oneviewlive')
              ? {
                  position: 'relative',
                  transition: 'box-shadow 0.2s, background 0.2s',
                }
              : {};
            return (
              <li key={item.path} className="nav-item">
                <NavLink 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={navLinkStyle}
                  onMouseEnter={e => {
                    if (item.path === '/oneviewlive') {
                      e.currentTarget.style.boxShadow = '0 0 12px 2px #00fff7';
                      e.currentTarget.style.background = 'rgba(0,255,255,0.13)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (item.path === '/oneviewlive') {
                      e.currentTarget.style.boxShadow = '';
                      e.currentTarget.style.background = '';
                    }
                  }}
                >
                  <span className="nav-icon" style={{ fontSize: '1.25rem' }}>
                    {item.icon}
                  </span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{item.label}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--cyber-text-muted)',
                      marginTop: '0.125rem'
                    }}>
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}



      {/* Home and Logout Buttons above bottom info box */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem', margin: '1.5rem 0 0 0' }}>
        <button
          onClick={() => { window.location.href = '/'; }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35em',
            minWidth: '70px',
            padding: '0.18rem 0.55rem',
            background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
            color: '#fff',
            fontWeight: '500',
            border: 'none',
            borderRadius: '0.13rem',
            boxShadow: '0 0 2px #6366f1',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.78rem',
            letterSpacing: '0.02em',
            textAlign: 'center',
            transition: 'background 0.2s'
          }}
        >
          <span style={{ fontSize: '1em' }}>🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/officerlogin';
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35em',
            minWidth: '70px',
            padding: '0.18rem 0.55rem',
            background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
            color: '#fff',
            fontWeight: '500',
            border: 'none',
            borderRadius: '0.13rem',
            boxShadow: '0 0 2px #ef4444',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.78rem',
            letterSpacing: '0.02em',
            textAlign: 'center',
            transition: 'background 0.2s'
          }}
        >
          <span style={{ fontSize: '1em' }}>🔒</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Fixed Bottom Box */}
      <div style={{ 
        margin: '1rem 1.5rem',
        padding: '1rem',
        background: 'rgba(0, 194, 255, 0.1)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 194, 255, 0.3)',
        flexShrink: 0
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--cyber-blue)',
          fontWeight: '600',
          marginBottom: '0.25rem'
        }}>
          🛡️ National CyberShield Hackathon 2025
        </div>
        <div style={{ 
          fontSize: '0.625rem', 
          color: 'var(--cyber-text-muted)'
        }}>
          Mapping A-Party to B-Party in IPDR Logs
        </div>
      </div>
    </nav>
  );
}

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    window.location.href = '/officerlogin';
    return null;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/officerlogin" element={<OfficerLogin />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/demodashboard" element={<DemoDashboard />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="App">
              <div className="main-layout">
                <Navigation />
                <main className="content-area">
                  <Dashboard />
                </main>
                <AlertsPanel />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <div className="App">
              <div className="main-layout">
                <Navigation />
                <main className="content-area">
                  <Upload />
                </main>
                <AlertsPanel />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute>
            <div className="App">
              <div className="main-layout">
                <Navigation />
                <main className="content-area">
                  <Analysis />
                </main>
                <AlertsPanel />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/visualization" element={
          <ProtectedRoute>
            <div className="App">
              <div className="main-layout">
                <Navigation />
                <main className="content-area">
                  <Visualization />
                </main>
                <AlertsPanel />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <div className="App">
              <div className="main-layout">
                <Navigation />
                <main className="content-area">
                  <Reports />
                </main>
                <AlertsPanel />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
