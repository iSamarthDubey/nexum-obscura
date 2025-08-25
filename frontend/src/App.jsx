import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Visualization from './pages/Visualization';
import Reports from './pages/Reports';
import './App.css';

// Navigation Component
function Navigation() {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
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
      <div className="nav-logo">
        <h1>NEXUM OBSCURA</h1>
        <p style={{ 
          color: 'var(--cyber-text-muted)', 
          fontSize: '0.875rem', 
          margin: '0.25rem 0 0 0',
          fontFamily: 'JetBrains Mono'
        }}>
          IPDR Investigation Platform
        </p>
      </div>
      
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
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
        ))}
      </ul>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '1rem', 
        left: '1.5rem', 
        right: '1.5rem',
        padding: '1rem',
        background: 'rgba(0, 194, 255, 0.1)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 194, 255, 0.3)'
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--cyber-blue)',
          fontWeight: '600',
          marginBottom: '0.25rem'
        }}>
          🛡️ CyberShield 2025
        </div>
        <div style={{ 
          fontSize: '0.625rem', 
          color: 'var(--cyber-text-muted)'
        }}>
          Law Enforcement Digital Forensics Platform
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main-layout">
          <Navigation />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/visualization" element={<Visualization />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
