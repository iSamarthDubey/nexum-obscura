import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Activity, TrendingUp, Eye, Server,
  Upload, FileText, BarChart3, Network, RefreshCw, Bell,
  Search, Filter, Calendar, Download, Settings, User,
  ChevronDown, ChevronRight, Lock, Database, Clock, 
  MapPin, Phone, Mail, Wifi, Router, Smartphone, 
  Computer, AlertCircle, CheckCircle, XCircle, Info,
  Target, Fingerprint, Scale, BookOpen, Archive,
  Key, Scan, HardDrive, Timer, UserCheck,
  FileSearch, Flag, Camera, Crosshair, Hash, Menu,
  Home, Users, FileX, Zap, Globe, Terminal
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setDashboardData({
          overview: {
            totalLogs: 2547823,
            suspiciousLogs: 1247,
            criticalLogs: 89,
            suspiciousPercentage: 4.9,
            activeCases: 12,
            closedCases: 234,
            evidenceItems: 4567,
            forensicHits: 45,
            activeThreats: 23,
            blockedAttacks: 1205
          },
          protocolDistribution: [
            { _id: 'HTTPS', count: 1245230, threat_level: 'low', change: '+2.3%' },
            { _id: 'HTTP', count: 432140, threat_level: 'medium', change: '-1.2%' },
            { _id: 'FTP', count: 289960, threat_level: 'high', change: '+15.7%' },
            { _id: 'SMTP', count: 189890, threat_level: 'medium', change: '+0.8%' },
            { _id: 'SSH', count: 128200, threat_level: 'high', change: '+45.2%' },
            { _id: 'TELNET', count: 45670, threat_level: 'critical', change: '+234.5%' }
          ],
          criticalAlerts: [
            {
              id: 'SEC-2024-001',
              type: 'Advanced Persistent Threat',
              source_ip: '192.168.1.145',
              target: 'Corporate Database',
              timestamp: '2024-08-30T19:24:15Z',
              severity: 'CRITICAL',
              case_ref: 'INV-2024-089',
              investigator: 'Sarah Johnson',
              confidence: 98,
              status: 'ACTIVE'
            },
            {
              id: 'SEC-2024-002', 
              type: 'Privilege Escalation',
              source_ip: '10.0.0.89',
              target: 'Active Directory',
              timestamp: '2024-08-30T18:45:32Z',
              severity: 'HIGH',
              case_ref: 'INV-2024-090',
              investigator: 'Michael Rodriguez',
              confidence: 87,
              status: 'INVESTIGATING'
            }
          ],
          activeCases: [
            {
              case_id: 'INV-2024-089',
              title: 'Operation Digital Fortress',
              classification: 'CONFIDENTIAL',
              lead_investigator: 'Sarah Johnson',
              priority: 'CRITICAL',
              created: '2024-08-28',
              last_activity: '2024-08-30T19:24:15Z',
              evidence_count: 1247,
              suspects: 3,
              status: 'ACTIVE',
              completion: 67
            },
            {
              case_id: 'INV-2024-087', 
              title: 'Phantom Network Analysis',
              classification: 'SECRET',
              lead_investigator: 'Lisa Chen',
              priority: 'HIGH',
              created: '2024-08-25',
              last_activity: '2024-08-30T16:30:22Z',
              evidence_count: 892,
              suspects: 2,
              status: 'EVIDENCE_REVIEW',
              completion: 43
            }
          ]
        });
        setLoading(false);
      }, 1200);
    };

    loadData();
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setIsConnected(Math.random() > 0.02);
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-cyan-300/50 rounded-full animate-spin" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">NEXUM OBSCURA</h2>
            <p className="text-cyan-400 font-medium">Initializing Secure Infrastructure</p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, protocolDistribution, criticalAlerts, activeCases } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl sticky top-0 z-50">
        <div className="max-w-full px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-wide">
                    NEXUM OBSCURA
                  </h1>
                  <p className="text-sm text-slate-400 font-medium tracking-wider">
                    ENTERPRISE SECURITY INTELLIGENCE PLATFORM
                  </p>
                </div>
              </div>
              
              <div className="hidden xl:block h-12 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              
              <div className="hidden xl:flex items-center space-x-8">
                <div className="flex items-center space-x-6">
                  {['Overview', 'Analytics', 'Cases', 'Intelligence'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveView(item.toLowerCase())}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeView === item.toLowerCase()
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-4 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300 font-medium">AES-256 Encrypted</span>
                </div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-slate-300 font-medium">
                    {isConnected ? 'SECURE' : 'RECONNECTING'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button className="p-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30">
                  <Bell className="w-5 h-5 text-white" />
                </button>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">{criticalAlerts?.length || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">Det. Johnson</div>
                  <div className="text-xs text-cyan-400 font-medium">Senior Investigator</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full px-8 py-8">
        {/* System Status Bar */}
        <div className="mb-8 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">System Status</h3>
                  <p className="text-sm text-slate-400">All systems operational • Last scan: {lastUpdate.toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">99.7%</div>
                  <div className="text-xs text-slate-400 font-medium">UPTIME</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">2.1ms</div>
                  <div className="text-xs text-slate-400 font-medium">LATENCY</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">847TB</div>
                  <div className="text-xs text-slate-400 font-medium">PROCESSED</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all backdrop-blur-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              <button 
                onClick={() => setLastUpdate(new Date())}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg shadow-cyan-500/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {criticalAlerts && criticalAlerts.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-red-900/40 via-red-800/30 to-orange-900/40 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 shadow-2xl shadow-red-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-300 mb-1">CRITICAL SECURITY INCIDENTS</h3>
                  <p className="text-red-200/80 font-medium">{criticalAlerts.length} active threats detected • Immediate response required</p>
                </div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-500/30 text-lg">
                RESPOND NOW
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8 mb-8">
          {/* KPI Cards */}
          <div className="2xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
                  <Database className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold tracking-wider">TOTAL RECORDS</div>
                  <div className="text-sm text-emerald-400 font-bold">+15.2%</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {overview?.totalLogs?.toLocaleString() || '0'}
                </h3>
                <p className="text-slate-300 font-medium text-lg">Log Entries Processed</p>
                <div className="text-sm text-slate-400">+12,847 in last 24h</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold tracking-wider">THREAT LEVEL</div>
                  <div className="text-sm text-amber-400 font-bold">ELEVATED</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  {overview?.suspiciousLogs?.toLocaleString() || '0'}
                </h3>
                <p className="text-slate-300 font-medium text-lg">Suspicious Activities</p>
                <div className="text-sm text-slate-400">{overview?.suspiciousPercentage?.toFixed(2) || '0'}% of total traffic</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl">
                  <Target className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold tracking-wider">CRITICAL</div>
                  <div className="text-sm text-red-400 font-bold">IMMEDIATE</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                  {overview?.criticalLogs?.toLocaleString() || '0'}
                </h3>
                <p className="text-slate-300 font-medium text-lg">Critical Threats</p>
                <div className="text-sm text-slate-400">Requiring immediate action</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl">
                  <Scale className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold tracking-wider">INVESTIGATIONS</div>
                  <div className="text-sm text-emerald-400 font-bold">ACTIVE</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                  {overview?.activeCases || '0'}
                </h3>
                <p className="text-slate-300 font-medium text-lg">Open Cases</p>
                <div className="text-sm text-slate-400">{overview?.closedCases || '0'} resolved this month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          {/* Critical Alerts - Takes 2 columns on 2xl screens */}
          <div className="2xl:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl">
            <div className="p-8 border-b border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Security Intelligence</h3>
                    <p className="text-slate-400 font-medium">Advanced threat detection and analysis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl text-sm font-bold border border-red-500/30">
                    {criticalAlerts?.length || 0} CRITICAL
                  </div>
                  <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all">
                    <Settings className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {criticalAlerts && criticalAlerts.length > 0 ? (
                <div className="space-y-6">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 shadow-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-xl border border-red-500/50">
                            <AlertTriangle className="w-6 h-6 text-red-300" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{alert.type}</h4>
                            <p className="text-sm text-slate-400 font-medium">ID: {alert.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="px-3 py-2 bg-red-500/20 text-red-300 rounded-xl text-sm font-bold border border-red-500/50">
                            {alert.severity}
                          </div>
                          <div className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-xl text-sm font-medium">
                            {alert.confidence}% CONF
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-1">SOURCE IP</div>
                          <div className="text-white font-mono text-sm bg-slate-800/50 px-3 py-2 rounded-lg">{alert.source_ip}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-1">TARGET</div>
                          <div className="text-cyan-400 font-medium text-sm">{alert.target}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-1">INVESTIGATOR</div>
                          <div className="text-white font-medium text-sm">{alert.investigator}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-1">TIMESTAMP</div>
                          <div className="text-slate-300 font-mono text-sm">{new Date(alert.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                            alert.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
                            alert.status === 'INVESTIGATING' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                            'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                          }`}>
                            {alert.status}
                          </div>
                          <div className="text-sm text-slate-400">Case: <span className="text-cyan-400 font-mono">{alert.case_ref}</span></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-sm font-medium transition-all border border-cyan-500/50">
                            Investigate
                          </button>
                          <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl inline-block mb-4">
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-400 mb-2">All Clear</h4>
                  <p className="text-slate-400 font-medium">No critical security incidents detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Cases Sidebar */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl">
            <div className="p-8 border-b border-slate-600/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Scale className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Active Cases</h3>
                    <p className="text-slate-400 font-medium">Investigation management</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-sm font-bold transition-all duration-300">
                  NEW CASE
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {activeCases && activeCases.length > 0 ? (
                <div className="space-y-6">
                  {activeCases.map((caseItem) => (
                    <div key={caseItem.case_id} className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 rounded-2xl p-6 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300 cursor-pointer shadow-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-bold text-white">{caseItem.title}</h4>
                            <div className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-bold">
                              {caseItem.classification}
                            </div>
                          </div>
                          <p className="text-sm text-cyan-400 font-mono">{caseItem.case_id}</p>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm font-bold ${
                          caseItem.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                          caseItem.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50' :
                          caseItem.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        }`}>
                          {caseItem.priority}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Lead Investigator</span>
                          <span className="text-white font-semibold">{caseItem.lead_investigator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Evidence Items</span>
                          <span className="text-cyan-400 font-bold">{caseItem.evidence_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Suspects</span>
                          <span className="text-white font-semibold">{caseItem.suspects}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 font-medium">Progress</span>
                          <span className="text-white font-bold">{caseItem.completion}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${caseItem.completion}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-2 rounded-xl text-sm font-bold ${
                          caseItem.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' :
                          caseItem.status === 'EVIDENCE_REVIEW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                          'bg-slate-500/20 text-slate-300 border border-slate-500/50'
                        }`}>
                          {caseItem.status.replace('_', ' ')}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all">
                            <FileSearch className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all">
                            <Camera className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all">
                            <Archive className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="p-6 bg-gradient-to-br from-slate-600/10 to-slate-700/10 rounded-2xl inline-block mb-4">
                    <Scale className="w-16 h-16 text-slate-500 mx-auto" />
                  </div>
                  <p className="text-slate-400 font-medium text-lg">No active investigations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Protocol Analysis */}
        <div className="mt-8 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl">
          <div className="p-8 border-b border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl">
                  <Network className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Network Protocol Analysis</h3>
                  <p className="text-slate-400 font-medium">Real-time traffic monitoring and threat assessment</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Filter</span>
                </button>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all flex items-center space-x-2">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Export</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {protocolDistribution?.map((protocol, index) => {
                const maxCount = Math.max(...protocolDistribution.map(p => p.count));
                const percentage = (protocol.count / maxCount) * 100;
                
                const threatStyles = {
                  critical: { 
                    bg: 'bg-gradient-to-br from-red-500/90 to-red-600/90', 
                    text: 'text-red-100', 
                    border: 'border-red-400/50',
                    indicator: 'bg-red-400',
                    shadow: 'shadow-red-500/20'
                  },
                  high: { 
                    bg: 'bg-gradient-to-br from-orange-500/90 to-orange-600/90', 
                    text: 'text-orange-100', 
                    border: 'border-orange-400/50',
                    indicator: 'bg-orange-400',
                    shadow: 'shadow-orange-500/20'
                  },
                  medium: { 
                    bg: 'bg-gradient-to-br from-amber-500/90 to-amber-600/90', 
                    text: 'text-amber-100', 
                    border: 'border-amber-400/50',
                    indicator: 'bg-amber-400',
                    shadow: 'shadow-amber-500/20'
                  },
                  low: { 
                    bg: 'bg-gradient-to-br from-emerald-500/90 to-emerald-600/90', 
                    text: 'text-emerald-100', 
                    border: 'border-emerald-400/50',
                    indicator: 'bg-emerald-400',
                    shadow: 'shadow-emerald-500/20'
                  }
                };
                
                const style = threatStyles[protocol.threat_level] || threatStyles.low;
                
                return (
                  <div key={protocol._id} className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${style.indicator} shadow-lg`}></div>
                        <span className="text-xl font-bold text-white">{protocol._id}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-xl text-xs font-bold ${style.bg} ${style.text} ${style.border} border`}>
                        {protocol.threat_level.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">{protocol.count.toLocaleString()}</div>
                        <div className="text-slate-400 font-medium">Total Connections</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Change</span>
                        <span className={`font-bold ${protocol.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {protocol.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Traffic Volume</span>
                        <span className="text-white font-bold">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <div
                          className={`${style.bg} h-3 rounded-full transition-all duration-1000 ${style.shadow} shadow-lg`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { icon: FileSearch, label: 'Evidence Analysis', color: 'cyan', desc: 'Digital forensics' },
            { icon: Network, label: 'Network Monitor', color: 'emerald', desc: 'Traffic analysis' },
            { icon: Scan, label: 'Device Scanner', color: 'purple', desc: 'Mobile forensics' },
            { icon: Archive, label: 'Case Archive', color: 'orange', desc: 'Historical data' },
            { icon: Terminal, label: 'Command Center', color: 'red', desc: 'System control' },
            { icon: Globe, label: 'Threat Intel', color: 'blue', desc: 'Global threats' }
          ].map((tool, index) => (
            <div key={tool.label} className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 cursor-pointer shadow-xl group">
              <div className="text-center">
                <div className={`p-4 bg-gradient-to-br from-${tool.color}-500/20 to-${tool.color}-600/20 rounded-2xl mb-4 group-hover:from-${tool.color}-500/30 group-hover:to-${tool.color}-600/30 transition-all duration-300`}>
                  <tool.icon className={`w-8 h-8 text-${tool.color}-400 mx-auto`} />
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{tool.label}</h4>
                <p className="text-slate-400 text-sm font-medium">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;