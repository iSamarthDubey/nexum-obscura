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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true); // Default to open on mobile

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
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{background: `linear-gradient(135deg, var(--cyber-bg) 0%, var(--cyber-surface) 50%, var(--cyber-bg) 100%)`}}>
      {/* Animated background elements - matching landing page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-pulse" style={{backgroundColor: `var(--cyber-blue)`}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-pulse delay-1000" style={{backgroundColor: `var(--cyber-green)`}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-3 rounded-full blur-3xl" style={{backgroundColor: `var(--cyber-blue)`}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--cyber-blue) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Navigation Bar */}
      <nav className="relative z-10 px-6 py-4 border-b backdrop-blur-xl" style={{borderBottomColor: `var(--cyber-border)`, background: `linear-gradient(135deg, var(--cyber-surface) 0%, var(--cyber-bg) 50%, var(--cyber-surface) 100%)` + '95'}}>
        {/* Cyber glow line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--cyber-blue)] to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="cyber-gradient p-2 rounded-lg group-hover:shadow-lg transition-all duration-300 relative" style={{boxShadow: `0 4px 15px rgba(0, 194, 255, 0.2)`}}>
              <ShieldCheckIcon className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--cyber-blue)] to-[var(--cyber-green)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-cyber cyber-text-gradient group-hover:scale-105 transition-transform duration-300">
                NEXUM OBSCURA
              </h1>
              <p className="text-xs font-mono-cyber" style={{color: `var(--cyber-text-muted)`}}>Advanced IPDR Investigation Platform</p>
            </div>
          </Link>

          {/* Center Tagline - Desktop Only */}
          <div className="hidden lg:block flex-1 text-center mx-8">
            <p className="text-sm font-medium tracking-wide font-cyber" style={{color: `var(--cyber-text)`}}>
              "From Obscurity to Insight."
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center space-x-2 border border-transparent"
              style={{color: `var(--cyber-text)`}}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <div className="h-4 w-px mx-3" style={{backgroundColor: `var(--cyber-border)`}} />
            
            <div className="text-xs font-mono-cyber px-3 py-1 rounded-full border cyber-badge-glow" style={{color: `var(--cyber-text-muted)`, backgroundColor: `var(--cyber-surface)`, borderColor: `var(--cyber-border)`}}>
              <span style={{color: `var(--cyber-green)`}}>🛡️</span> National CyberShield Hackathon 2025
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 transition-colors border rounded-lg text-[#8B949E] border-[#21262D] hover:text-[#F0F6FC] hover:bg-[#161B22]"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 backdrop-blur-sm border-b px-6 py-4" style={{backgroundColor: `var(--cyber-surface)` + '95', borderBottomColor: `var(--cyber-border)`}}>
            {/* Mobile Welcome Message */}
            <div className="mb-4 text-center">
              <p className="text-sm font-medium font-cyber" style={{color: `var(--cyber-text)`}}>
                Welcome to NEXUM OBSCURA
              </p>
              <p className="text-xs mt-1 font-mono-cyber" style={{color: `var(--cyber-text-muted)`}}>
                Secure access to advanced cybersecurity investigation tools
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center space-x-2 border border-transparent"
                style={{color: `var(--cyber-text)`}}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <div className="mt-3 pt-3 border-t" style={{borderTopColor: `var(--cyber-border)`}}>
                <div className="text-xs font-mono-cyber text-center px-3 py-1 rounded-full border cyber-badge-glow inline-block" style={{color: `var(--cyber-text-muted)`, backgroundColor: `var(--cyber-surface)`, borderColor: `var(--cyber-border)`}}>
                  <span style={{color: `var(--cyber-green)`}}>🛡️</span> National CyberShield Hackathon 2025
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:block space-y-8 pr-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full border" style={{backgroundColor: `var(--cyber-blue)` + '10', borderColor: `var(--cyber-blue)` + '20'}}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: `var(--cyber-green)`}} />
                <span className="text-sm font-medium font-cyber" style={{color: `var(--cyber-blue)`}}>Secure Officer Portal</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-cyber" style={{color: `var(--cyber-text)`}}>
                Welcome to
                <span className="block cyber-text-gradient">
                  NEXUM OBSCURA
                </span>
              </h1>
              
              <p className="text-lg leading-relaxed max-w-md" style={{color: `var(--cyber-text)`}}>
                Advanced cybersecurity investigation platform for IPDR log analysis, 
                anomaly detection, and threat intelligence.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-cyber" style={{color: `var(--cyber-text)`}}>Platform Features:</h3>
              <div className="grid gap-3">
                {[
                  "Real-time IPDR Log Analysis",
                  "Advanced Anomaly Detection", 
                  "Geographic Threat Mapping",
                  "Automated Report Generation"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: `var(--cyber-blue)`}} />
                    <span style={{color: `var(--cyber-text)`}}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:ml-8">
            <div className="backdrop-blur-xl border rounded-2xl p-8 shadow-2xl" style={{backgroundColor: `var(--cyber-surface)` + '50', borderColor: `var(--cyber-border)`}}>
              <div className="text-center mb-8">
                <div className="cyber-gradient inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 font-cyber" style={{color: `var(--cyber-text)`}}>Officer Login</h2>
                <p className="font-medium" style={{color: `var(--cyber-green)`}}>Access the investigation dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: `var(--cyber-text)`}}>
                    Officer Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5" style={{color: `var(--cyber-text-muted)`}} />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 placeholder-gray-400"
                      style={{
                        backgroundColor: 'white',
                        borderColor: `var(--cyber-border)`,
                        color: 'black',
                        ':focus': {
                          ringColor: `var(--cyber-blue)`,
                          borderColor: 'transparent'
                        }
                      }}
                      placeholder="Enter your officer ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: `var(--cyber-text)`}}>
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 w-5 h-5" style={{color: `var(--cyber-text-muted)`}} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 placeholder-gray-400"
                      style={{
                        backgroundColor: 'white',
                        borderColor: `var(--cyber-border)`,
                        color: 'black',
                        ':focus': {
                          ringColor: `var(--cyber-blue)`,
                          borderColor: 'transparent'
                        }
                      }}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 transition-colors"
                      style={{color: `var(--cyber-text-muted)`, ':hover': {color: `var(--cyber-text)`}}}
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 border rounded-lg" style={{backgroundColor: `var(--cyber-red)` + '10', borderColor: `var(--cyber-red)` + '20'}}>
                    <p className="text-sm" style={{color: `var(--cyber-red)`}}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-gradient cyber-button w-full py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-white"
                >
                  {loading ? "Authenticating..." : "Access Dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Panel - Separate floating widget */}
      <div className="fixed bottom-32 right-6 z-20">
        <div className="backdrop-blur-xl border rounded-xl p-5 shadow-2xl max-w-sm" style={{backgroundColor: `var(--cyber-surface)` + '90', borderColor: `var(--cyber-border)`}}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center space-x-2 font-cyber" style={{color: `var(--cyber-text)`}}>
              <ClipboardDocumentIcon className="w-4 h-4" style={{color: `var(--cyber-blue)`}} />
              <span>Demo Credentials</span>
            </h3>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg" style={{backgroundColor: `var(--cyber-bg)` + '50'}}>
              <span style={{color: `var(--cyber-text)`}}>Username:</span>
              <button
                onClick={() => handleCopy("username")}
                className="transition-colors"
                style={{color: `var(--cyber-blue)`, ':hover': {color: `var(--cyber-blue)` + 'CC'}}}
                title="Click to copy"
              >
                {copied === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg" style={{backgroundColor: `var(--cyber-bg)` + '50'}}>
              <span style={{color: `var(--cyber-text)`}}>Password:</span>
              <button
                onClick={() => handleCopy("password")}
                className="transition-colors"
                style={{color: `var(--cyber-blue)`, ':hover': {color: `var(--cyber-blue)` + 'CC'}}}
                title="Click to copy"
              >
                {copied === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAutoFill}
            className="w-full mt-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 border"
            style={{
              backgroundColor: `var(--cyber-blue)` + '20',
              color: `var(--cyber-blue)`,
              borderColor: `var(--cyber-blue)` + '30',
              ':hover': {
                backgroundColor: `var(--cyber-blue)` + '30'
              }
            }}
          >
            Auto-fill Credentials
          </button>
        </div>
      </div>

      {/* Footer with Team and Open Source Info */}
      <footer className="mt-auto backdrop-blur-xl border-t shadow-2xl z-10" style={{background: `linear-gradient(135deg, var(--cyber-surface) 0%, var(--cyber-bg) 50%, var(--cyber-surface) 100%)` + '95', borderTopColor: `var(--cyber-border)`}}>
        {/* Cyber glow line effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--cyber-blue)] to-transparent opacity-60"></div>
        
        <div className="relative">
          {/* Animated particles */}
          <div className="absolute top-2 left-1/4 w-1 h-1 rounded-full animate-pulse opacity-40" style={{backgroundColor: `var(--cyber-green)`}}></div>
          <div className="absolute top-3 right-1/4 w-1 h-1 rounded-full animate-pulse opacity-40" style={{backgroundColor: `var(--cyber-blue)`, animationDelay: '1s'}}></div>
          
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm p-6 relative z-10">
            <div className="mb-4 md:mb-0 text-center md:text-left group">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 transition-all duration-300 group-hover:scale-110" style={{color: `var(--cyber-green)`, filter: `drop-shadow(0 0 4px var(--cyber-green))`}} />
                <span className="text-lg font-bold font-cyber cyber-text-gradient transition-all duration-300 group-hover:scale-105" style={{textShadow: `0 0 12px var(--cyber-green)30`}}>Nexum Obscura</span>
              </div>
              <p className="text-sm opacity-90 font-medium" style={{color: `var(--cyber-text)`}}>
                Mapping A-Party to B-Party in IPDR Logs
              </p>
            </div>

            {/* Centered Open Source link */}
            <div className="group relative mb-4 md:mb-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{borderColor: `var(--cyber-blue)` + '40', backgroundColor: `var(--cyber-bg)` + '50'}}>
                <svg className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:text-[var(--cyber-blue)]" style={{color: `var(--cyber-text)`, filter: `drop-shadow(0 0 2px var(--cyber-text-muted))`}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <a href="https://github.com/iSamarthDubey/nexum-obscura" 
                   className="transition-all duration-300 font-medium group-hover:text-[var(--cyber-blue)]" 
                   style={{color: `var(--cyber-text)`}}>
                  Open Source
                </a>
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-all duration-300" style={{backgroundColor: `var(--cyber-blue)`, filter: 'blur(8px)', zIndex: -1}}></div>
            </div>
            
            {/* Enhanced team info section */}
            <div className="group relative">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{borderColor: `var(--cyber-green)` + '40', backgroundColor: `var(--cyber-bg)` + '50'}}>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: `var(--cyber-green)`, boxShadow: `0 0 6px var(--cyber-green)`}}></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-30" style={{backgroundColor: `var(--cyber-green)`}}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium transition-all duration-300" style={{color: `var(--cyber-text-muted)`}}>
                    Developed by Team
                  </span>
                  <span className="text-sm font-bold cyber-text-gradient transition-all duration-300 group-hover:scale-105" style={{color: `var(--cyber-green)`, textShadow: `0 0 8px var(--cyber-green)40`}}>
                    Obscura Collective
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-all duration-300" style={{backgroundColor: `var(--cyber-green)`, filter: 'blur(10px)', zIndex: -1}}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OfficerLogin;
