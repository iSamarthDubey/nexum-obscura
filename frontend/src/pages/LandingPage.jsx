import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  GlobeAltIcon, 
  EyeIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowRightIcon,
  CpuChipIcon,
  BoltIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <CloudArrowUpIcon className="w-12 h-12" />,
      title: "IPDR Log Processing",
      description: "High-volume CSV log processing (50MB+ files) with automated parsing and validation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ExclamationTriangleIcon className="w-12 h-12" />,
      title: "Rule-Based Threat Detection",
      description: "Advanced anomaly detection algorithms with automated threat scoring system",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <GlobeAltIcon className="w-12 h-12" />,
      title: "Network Visualization",
      description: "Interactive network topology graphs using Cytoscape.js for pattern analysis",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const coreFeatures = [
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: "CSV Log Upload",
      description: "Drag-and-drop file upload system with validation for IPDR logs"
    },
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8" />,
      title: "Advanced Search & Filtering",
      description: "Find specific patterns in massive datasets with smart search capabilities"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Real-time Dashboard",
      description: "30-second auto-refresh monitoring with comprehensive insights"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Network Topology",
      description: "Interactive network graphs using Cytoscape.js for relationship mapping"
    },
    {
      icon: <ExclamationTriangleIcon className="w-8 h-8" />,
      title: "Suspicion Scoring",
      description: "Rule-based threat assessment and risk calculation system"
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: "Report Generation",
      description: "Professional security reports with CSV export capabilities"
    }
  ];

  const achievements = [
    "✅ Fully Functional Production Deployment",
    "✅ Rule-Based Threat Detection System", 
    "✅ Interactive Network Visualization",
    "✅ Professional-Grade User Interface",
    "✅ IPDR Log Processing & Analysis",
    "✅ RESTful API Architecture"
  ];

  const stats = [
    { label: "Live Production", value: "🌐 Active", icon: <CheckCircleIcon className="w-6 h-6" /> },
    { label: "File Processing", value: "50MB+", icon: <CloudArrowUpIcon className="w-6 h-6" /> },
    { label: "Dashboard Refresh", value: "30sec", icon: <ClockIcon className="w-6 h-6" /> },
    { label: "Tech Stack", value: "MERN", icon: <CpuChipIcon className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen cyber-grid" style={{ background: 'var(--cyber-bg)', color: 'var(--cyber-text)' }}>
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b" style={{ borderColor: 'var(--cyber-border)' }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center cyber-glow" 
                     style={{ background: 'var(--cyber-surface)', border: `1px solid var(--cyber-border)` }}>
                  <ShieldCheckIcon className="w-6 h-6" style={{ color: 'var(--cyber-blue)' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-cyber" style={{ color: 'var(--cyber-blue)' }}>
                    Nexum Obscura
                  </h1>
                  <p className="text-xs" style={{ color: 'var(--cyber-text-muted)' }}>
                    Advanced Cybersecurity Platform
                  </p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="https://github.com/iSamarthDubey/nexum-obscura/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 border"
                  style={{ 
                    color: 'var(--cyber-blue)', 
                    borderColor: 'var(--cyber-border)',
                    background: 'transparent'
                  }}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Documentation</span>
                </a>
                <a
                  href="https://obscura-collective.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{ 
                    color: 'var(--cyber-text)', 
                    background: 'transparent'
                  }}
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg border transition-all duration-300"
                  style={{ 
                    color: 'var(--cyber-blue)', 
                    borderColor: 'var(--cyber-border)' 
                  }}
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="w-5 h-5" />
                  ) : (
                    <Bars3Icon className="w-5 h-5" />
                  )}
                </button>
                
                <Link
                  to="/dashboard"
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 cyber-glow flex items-center space-x-2"
                  style={{ 
                    backgroundColor: 'var(--cyber-blue)', 
                    color: 'var(--cyber-bg)' 
                  }}
                >
                  <span className="hidden sm:inline">Launch Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t" style={{ borderColor: 'var(--cyber-border)' }}>
                <div className="px-6 py-4 space-y-3">
                  <a
                    href="https://github.com/iSamarthDubey/nexum-obscura/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border"
                    style={{ 
                      color: 'var(--cyber-blue)', 
                      borderColor: 'var(--cyber-border)',
                      background: 'var(--cyber-surface)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Documentation</span>
                  </a>
                  <a
                    href="https://obscura-collective.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border"
                    style={{ 
                      color: 'var(--cyber-text)', 
                      borderColor: 'var(--cyber-border)',
                      background: 'var(--cyber-surface)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <GlobeAltIcon className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 border-b" style={{ 
          background: 'rgba(13, 16, 23, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderColor: 'var(--cyber-border)' 
        }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-8 py-4">
              <a
                href="#hero"
                className="nav-link-item px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-blue-900 hover:bg-opacity-50"
                style={{ color: '#e2e8f0' }}
              >
                🏠 Home
              </a>
              <a
                href="#demo-preview"
                className="nav-link-item px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-green-900 hover:bg-opacity-50"
                style={{ color: '#e2e8f0' }}
              >
                🎭 Demo
              </a>
              <a
                href="#features"
                className="nav-link-item px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-purple-900 hover:bg-opacity-50"
                style={{ color: '#e2e8f0' }}
              >
                ⚡ Features
              </a>
              <a
                href="#about"
                className="nav-link-item px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-orange-900 hover:bg-opacity-50"
                style={{ color: '#e2e8f0' }}
              >
                👥 About Us
              </a>
              <a
                href="#documentation"
                className="nav-link-item px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:bg-opacity-50"
                style={{ color: '#e2e8f0' }}
              >
                📚 Documentation
              </a>
              <Link
                to="/demo-dashboard"
                className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 cyber-glow"
                style={{ 
                  backgroundColor: 'var(--cyber-green)', 
                  color: 'var(--cyber-bg)' 
                }}
              >
                🚀 Try Demo
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6 border cyber-glow" 
                 style={{ 
                   background: 'var(--cyber-surface)', 
                   borderColor: 'var(--cyber-border)' 
                 }}>
              <StarIcon className="w-4 h-4" style={{ color: 'var(--cyber-blue)' }} />
              <span className="text-sm font-cyber" style={{ color: 'var(--cyber-blue)' }}>
                National CyberShield Hackathon 2025
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-cyber mb-6 leading-tight" style={{ color: 'var(--cyber-text)' }}>
              Advanced
              <br />
              <span style={{ color: 'var(--cyber-blue)' }}>
                IPDR Analysis
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--cyber-text-muted)' }}>
              Real-time network log analysis platform for cybersecurity investigations. 
              Process IPDR logs, detect anomalies, and generate professional forensic reports.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/dashboard"
                className="group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cyber-glow"
                style={{ 
                  backgroundColor: 'var(--cyber-blue)', 
                  color: 'var(--cyber-bg)' 
                }}
              >
                <PlayIcon className="w-5 h-5" />
                <span>Start Analysis</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/demo-dashboard"
                className="group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cyber-glow"
                style={{ 
                  backgroundColor: 'var(--cyber-green)', 
                  color: 'var(--cyber-bg)' 
                }}
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Dashboard Sample</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="#features"
                className="px-8 py-4 border-2 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
                style={{ 
                  borderColor: 'var(--cyber-border)', 
                  color: 'var(--cyber-text)',
                  background: 'transparent'
                }}
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Learn More</span>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl border cyber-glow" 
                   style={{ 
                     background: 'var(--cyber-surface)', 
                     borderColor: 'var(--cyber-border)' 
                   }}>
                <div className="flex justify-center mb-3" style={{ color: 'var(--cyber-blue)' }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-cyber mb-1" style={{ color: 'var(--cyber-text)' }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Sample Preview */}
        <section id="demo-preview" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
              Live Demo Dashboard
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--cyber-text-muted)' }}>
              Experience our platform with 500+ realistic cybersecurity data entries
            </p>
            <Link
              to="/demo-dashboard"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 cyber-glow"
              style={{ 
                backgroundColor: 'var(--cyber-green)', 
                color: 'var(--cyber-bg)' 
              }}
            >
              <ChartBarIcon className="w-6 h-6" />
              <span>Explore Dashboard Sample</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          {/* Dashboard Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border cyber-glow hover:scale-105 transition-transform duration-300" 
                 style={{ 
                   background: 'var(--cyber-surface)', 
                   borderColor: 'var(--cyber-border)' 
                 }}>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4 bg-blue-100">
                  <ChartBarIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--cyber-text)' }}>Real-time Analytics</h3>
              </div>
              <p style={{ color: 'var(--cyber-text-muted)' }}>
                Interactive charts showing traffic patterns, protocol distribution, and anomaly detection across 500+ entries
              </p>
              <div className="mt-4 text-sm" style={{ color: 'var(--cyber-blue)' }}>
                ✓ 20+ Indian Cities Coverage
              </div>
            </div>

            <div className="p-6 rounded-xl border cyber-glow hover:scale-105 transition-transform duration-300" 
                 style={{ 
                   background: 'var(--cyber-surface)', 
                   borderColor: 'var(--cyber-border)' 
                 }}>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4 bg-green-100">
                  <GlobeAltIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--cyber-text)' }}>Geographic Mapping</h3>
              </div>
              <p style={{ color: 'var(--cyber-text-muted)' }}>
                Visual threat distribution across Indian regions with risk level indicators and connection analysis
              </p>
              <div className="mt-4 text-sm" style={{ color: 'var(--cyber-green)' }}>
                ✓ Threat Heat Mapping
              </div>
            </div>

            <div className="p-6 rounded-xl border cyber-glow hover:scale-105 transition-transform duration-300" 
                 style={{ 
                   background: 'var(--cyber-surface)', 
                   borderColor: 'var(--cyber-border)' 
                 }}>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4 bg-orange-100">
                  <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--cyber-text)' }}>Anomaly Detection</h3>
              </div>
              <p style={{ color: 'var(--cyber-text-muted)' }}>
                Advance threat identification including attacks, port scans, and suspicious data patterns
              </p>
              <div className="mt-4 text-sm" style={{ color: 'var(--cyber-orange)' }}>
                ✓ 15% Threat Detection Rate
              </div>
            </div>
          </div>
        </section>

        {/* Rotating Feature Showcase */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
              Powerful Features
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--cyber-text-muted)' }}>
              Advanced cybersecurity capabilities powered by cutting-edge technology
            </p>
          </div>

          <div className="relative h-96 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentFeatureIndex 
                    ? 'opacity-100 transform scale-100' 
                    : 'opacity-0 transform scale-95'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-center h-full space-y-8 md:space-y-0 md:space-x-12">
                  <div className="w-32 h-32 rounded-3xl flex items-center justify-center cyber-glow transform rotate-12 hover:rotate-0 transition-transform duration-500" 
                       style={{ 
                         background: 'var(--cyber-surface)', 
                         border: `2px solid var(--cyber-blue)`,
                         color: 'var(--cyber-blue)'
                       }}>
                    {feature.icon}
                  </div>
                  <div className="text-center md:text-left max-w-lg">
                    <h3 className="text-3xl font-cyber mb-4" style={{ color: 'var(--cyber-text)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--cyber-text-muted)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature indicators */}
          <div className="flex justify-center space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeatureIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeatureIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Complete Security Suite</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need for comprehensive cybersecurity analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Achievements */}
        <section className="py-20 px-6 lg:px-8" style={{ background: 'var(--cyber-surface)', borderTop: '1px solid var(--cyber-border)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
                Hackathon Achievements
              </h2>
              <p className="text-xl" style={{ color: 'var(--cyber-text)' }}>
                What we've successfully delivered for CyberShield 2025
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-6 rounded-xl border cyber-glow"
                  style={{ background: 'var(--cyber-bg)', borderColor: 'var(--cyber-border)' }}
                >
                  <CheckCircleIcon className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--cyber-green)' }} />
                  <span style={{ color: 'var(--cyber-text)' }}>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Documentation */}
        <section className="py-20 px-6 lg:px-8" style={{ background: 'var(--cyber-bg)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
                Platform Documentation
              </h2>
              <p className="text-xl" style={{ color: 'var(--cyber-text)' }}>
                Technical specifications and usage guide for Nexum Obscura
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-xl p-6 border cyber-glow" style={{ background: 'var(--cyber-surface)', borderColor: 'var(--cyber-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 cyber-glow" 
                     style={{ background: 'var(--cyber-blue)', color: 'var(--cyber-bg)' }}>
                  <CloudArrowUpIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-cyber mb-3" style={{ color: 'var(--cyber-blue)' }}>Quick Start Guide</h3>
                <p className="mb-4" style={{ color: 'var(--cyber-text)' }}>Upload and analyze IPDR logs in minutes</p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Upload CSV files (50MB+)</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Automatic parsing & validation</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Real-time dashboard monitoring</li>
                </ul>
              </div>

              <div className="rounded-xl p-6 border cyber-glow" style={{ background: 'var(--cyber-surface)', borderColor: 'var(--cyber-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 cyber-glow" 
                     style={{ background: 'var(--cyber-blue)', color: 'var(--cyber-bg)' }}>
                  <CpuChipIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-cyber mb-3" style={{ color: 'var(--cyber-blue)' }}>Tech Stack</h3>
                <p className="mb-4" style={{ color: 'var(--cyber-text)' }}>Modern MERN stack architecture</p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />React + Tailwind CSS</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Node.js + Express API</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />MongoDB + Cytoscape.js</li>
                </ul>
              </div>

              <div className="rounded-xl p-6 border cyber-glow" style={{ background: 'var(--cyber-surface)', borderColor: 'var(--cyber-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 cyber-glow" 
                     style={{ background: 'var(--cyber-blue)', color: 'var(--cyber-bg)' }}>
                  <GlobeAltIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-cyber mb-3" style={{ color: 'var(--cyber-blue)' }}>Live Deployment</h3>
                <p className="mb-4" style={{ color: 'var(--cyber-text)' }}>Production-ready cybersecurity platform</p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Frontend: Vercel</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Backend: Render</li>
                  <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" style={{ color: 'var(--cyber-green)' }} />Database: MongoDB Atlas</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 lg:px-8" style={{ background: 'var(--cyber-bg)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-2xl p-12 border cyber-glow" style={{ background: 'var(--cyber-surface)', borderColor: 'var(--cyber-border)' }}>
              <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--cyber-blue)' }} />
              <h2 className="text-4xl lg:text-5xl font-bold font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
                Ready to Analyze IPDR Logs?
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--cyber-text)' }}>
                Start your cybersecurity investigation with our advanced IPDR analysis platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link 
                  to="/dashboard" 
                  className="w-full sm:w-auto px-8 py-4 text-black rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 cyber-glow"
                  style={{ backgroundColor: 'var(--cyber-blue)' }}
                >
                  Launch Platform
                </Link>
                <a 
                  href="https://github.com/iSamarthDubey/nexum-obscura" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold border transition-all duration-300 hover:scale-105"
                  style={{ color: 'var(--cyber-blue)', borderColor: 'var(--cyber-blue)', background: 'transparent' }}
                >
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 px-6 lg:px-8" style={{ background: 'var(--cyber-surface)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
                About Us
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--cyber-text-muted)' }}>
                Meet the minds behind the innovation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Team Info */}
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#0066cc' }}>
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Team Name: Obscura Collective</h3>
                      <p className="text-lg font-medium" style={{ color: 'var(--cyber-green)' }}>&quot;Obscurity to Insight&quot;</p>
                    </div>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                    We are a group of curious builders passionate about solving rare and impactful cyber-forensic problems. 
                    Our mission is to transform hidden, complex data into clear and actionable intelligence for investigators.
                  </p>

                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span style={{ color: 'var(--cyber-blue)' }}>Active in CyberShield 2025</span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#22c55e' }}>
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Project Name: Nexum Obscura</h3>
                      <p className="text-lg font-medium" style={{ color: 'var(--cyber-green)' }}>&quot;Nexum&quot; = connection, &quot;Obscura&quot; = hidden</p>
                    </div>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                    Our solution connects the dots in IPDR logs, uncovering hidden relationships between A-party and B-party entities. 
                    It empowers investigators with a real-time dashboard, suspicion scoring, and anomaly insights — turning obscure 
                    patterns into actionable leads.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg" style={{ background: 'var(--cyber-surface)' }}>
                      <div className="text-2xl font-bold" style={{ color: 'var(--cyber-blue)' }}>500+</div>
                      <div className="text-sm" style={{ color: 'var(--cyber-text-muted)' }}>Sample Records</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: 'var(--cyber-surface)' }}>
                      <div className="text-2xl font-bold" style={{ color: 'var(--cyber-green)' }}>20+</div>
                      <div className="text-sm" style={{ color: 'var(--cyber-text-muted)' }}>Indian Cities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="mt-16 text-center">
              <div className="max-w-4xl mx-auto rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--cyber-blue)' }}>Our Mission</h3>
                <p className="text-xl leading-relaxed" style={{ color: 'var(--cyber-text-muted)' }}>
                  To bridge the gap between complex cybersecurity data and actionable intelligence, 
                  empowering law enforcement and cybersecurity professionals with cutting-edge tools 
                  for digital forensics and threat analysis.
                </p>
                <div className="mt-8 flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--cyber-surface)' }}>
                      <MagnifyingGlassIcon className="w-8 h-8" style={{ color: 'var(--cyber-blue)' }} />
                    </div>
                    <span className="font-medium" style={{ color: 'var(--cyber-blue)' }}>Investigate</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--cyber-surface)' }}>
                      <LightBulbIcon className="w-8 h-8" style={{ color: 'var(--cyber-green)' }} />
                    </div>
                    <span className="font-medium" style={{ color: 'var(--cyber-green)' }}>Analyze</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--cyber-surface)' }}>
                      <ShieldCheckIcon className="w-8 h-8" style={{ color: 'var(--cyber-orange)' }} />
                    </div>
                    <span className="font-medium" style={{ color: 'var(--cyber-orange)' }}>Protect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="documentation" className="py-20 px-6 lg:px-8" style={{ background: 'var(--cyber-bg)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cyber mb-6" style={{ color: 'var(--cyber-blue)' }}>
                Documentation & Resources
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--cyber-text-muted)' }}>
                Everything you need to understand and implement Nexum Obscura
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Getting Started */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#22c55e' }}>
                    <PlayIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Getting Started</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Quick setup guide to get Nexum Obscura running on your system with sample data.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Installation Instructions
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Environment Setup
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Sample Data Import
                  </li>
                </ul>
              </div>

              {/* API Documentation */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#3b82f6' }}>
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-blue)' }}>API Reference</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Comprehensive API documentation for IPDR processing and analysis endpoints.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Upload Endpoints
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Analysis APIs
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Report Generation
                  </li>
                </ul>
              </div>

              {/* Architecture Guide */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#8b5cf6' }}>
                    <CpuChipIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Architecture</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Deep dive into the system architecture and design decisions behind Nexum Obscura.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    System Design
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Data Flow
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Security Model
                  </li>
                </ul>
              </div>

              {/* Deployment Guide */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#f59e0b' }}>
                    <CloudArrowUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Deployment</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Production deployment guides for various environments and cloud platforms.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}>
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Docker Setup
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Cloud Deployment
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Security Configuration
                  </li>
                </ul>
              </div>

              {/* Troubleshooting */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #1e293b 80%, #0f172a 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#ef4444' }}>
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-orange)' }}>Troubleshooting</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Common issues and their solutions to help you debug and optimize performance.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}><CheckCircleIcon className="w-4 h-4 mr-2 text-orange-400" />MongoDB Connection Errors</li>
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}><CheckCircleIcon className="w-4 h-4 mr-2 text-orange-400" />File Upload Issues</li>
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}><CheckCircleIcon className="w-4 h-4 mr-2 text-orange-400" />Dashboard Not Loading</li>
                </ul>
              </div>

              {/* Community */}
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: '#06b6d4' }}>
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyber-blue)' }}>Community</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--cyber-text-muted)' }}>
                  Join our community of cybersecurity professionals and contribute to the project.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}><CheckCircleIcon className="w-4 h-4 mr-2 text-blue-400" /><a href="https://github.com/iSamarthDubey/nexum-obscura/issues" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-blue)' }}>GitHub Issues</a></li>
                  <li className="flex items-center text-sm" style={{ color: 'var(--cyber-text-muted)' }}><CheckCircleIcon className="w-4 h-4 mr-2 text-blue-400" /><a href="mailto:support@nexum-obscura.com" style={{ color: 'var(--cyber-blue)' }}>Email Support</a></li>
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-16 text-center">
              <div className="rounded-2xl p-8 shadow-xl border cyber-glow" style={{ borderColor: 'var(--cyber-border)', background: 'linear-gradient(135deg, #0f172a 80%, #1e293b 100%)' }}>
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--cyber-blue)' }}>Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a
                    href="https://github.com/iSamarthDubey/nexum-obscura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg border cyber-glow hover:border-blue-500 transition-colors text-center"
                    style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-surface)' }}
                  >
                    <div className="text-2xl mb-2" style={{ color: 'var(--cyber-blue)' }}>📁</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--cyber-text)' }}>GitHub Repo</div>
                  </a>
                  <Link
                    to="/demo-dashboard"
                    className="p-4 rounded-lg border cyber-glow hover:border-green-500 transition-colors text-center"
                    style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-surface)' }}
                  >
                    <div className="text-2xl mb-2" style={{ color: 'var(--cyber-green)' }}>🎭</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--cyber-text)' }}>View Demo / Sample</div>
                  </Link>
                  <a
                    href="https://obscura-collective.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg border cyber-glow hover:border-purple-500 transition-colors text-center"
                    style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-surface)' }}
                  >
                    <div className="text-2xl mb-2" style={{ color: 'var(--cyber-purple)' }}>🌐</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--cyber-text)' }}>View Live / Deployed</div>
                  </a>
                  <a
                    href="#about"
                    className="p-4 rounded-lg border cyber-glow hover:border-orange-500 transition-colors text-center"
                    style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-surface)' }}
                  >
                    <div className="text-2xl mb-2" style={{ color: 'var(--cyber-orange)' }}>👥</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--cyber-text)' }}>About Team</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-surface)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--cyber-blue)' }}>
                  <ShieldCheckIcon className="w-5 h-5" style={{ color: 'var(--cyber-bg)' }} />
                </div>
                <span className="text-xl font-cyber" style={{ color: 'var(--cyber-blue)' }}>Nexum Obscura</span>
              </div>
              <p style={{ color: 'var(--cyber-text-muted)' }}>
                Built for National CyberShield Hackathon 2025 by Team Obscura Collective
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <a 
                  href="https://obscura-collective.vercel.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--cyber-blue)' }}
                >
                  Live Demo
                </a>
                <a 
                  href="https://github.com/iSamarthDubey/nexum-obscura" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--cyber-blue)' }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
