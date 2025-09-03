import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ClipboardDocumentIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DEMO_USERNAME = "DemoOfficer@NexumObscura";
const DEMO_PASSWORD = "ObscuraCollective";

const OfficerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopy = (type) => {
    const value = type === "username" ? DEMO_USERNAME : DEMO_PASSWORD;
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleAutoFill = () => {
    setUsername(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem('authToken', 'demo-token');
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Please verify your officer ID and password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(14,165,233,0.2),transparent_50%)]" />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 px-6 py-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                NEXUM OBSCURA
              </h1>
              <p className="text-xs text-slate-400 font-mono">Advanced IPDR Investigation Platform</p>
            </div>
          </Link>

          {/* Center Tagline - Desktop Only */}
          <div className="hidden lg:block flex-1 text-center mx-8">
            <p className="text-sm text-slate-300 font-medium tracking-wide">
              "From Obscurity to Insight" 
              <span className="text-slate-500 mx-2">•</span>
              <span className="text-cyan-400">Secure Officer Access Portal</span>
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <div className="h-4 w-px bg-slate-600 mx-3" />
            
            <div className="text-xs text-slate-400 font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
              <span className="text-cyan-400">🛡️</span> National CyberShield Hackathon 2025
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
            {/* Mobile Welcome Message */}
            <div className="mb-4 text-center">
              <p className="text-sm text-slate-300 font-medium">
                Welcome to NEXUM OBSCURA
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Secure access to advanced cybersecurity investigation tools
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <div className="text-xs text-slate-400 font-mono text-center">
                  <span className="text-cyan-400">🛡️</span> National CyberShield Hackathon 2025
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">Secure Officer Portal</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  NEXUM OBSCURA
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                Advanced cybersecurity investigation platform for IPDR log analysis, 
                anomaly detection, and threat intelligence.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Platform Features:</h3>
              <div className="grid gap-3">
                {[
                  "Real-time IPDR Log Analysis",
                  "Advanced Anomaly Detection", 
                  "Geographic Threat Mapping",
                  "Automated Report Generation"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl mb-4">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Officer Login</h2>
                <p className="text-slate-400">Access the investigation dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Officer Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your officer ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? "Authenticating..." : "Access Dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Panel - Separate floating widget */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ClipboardDocumentIcon className="w-4 h-4 text-cyan-400" />
              <span>Demo Credentials</span>
            </h3>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Username:</span>
              <button
                onClick={() => handleCopy("username")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Click to copy"
              >
                {copied === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Password:</span>
              <button
                onClick={() => handleCopy("password")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Click to copy"
              >
                {copied === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAutoFill}
            className="w-full mt-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs font-medium rounded-lg transition-all duration-200 border border-cyan-600/30"
          >
            Auto-fill Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;
