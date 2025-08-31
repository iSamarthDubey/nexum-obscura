import React, { useEffect, useState, useRef } from "react";
import {
  ShieldCheck,
  Activity,
  Lock,
  Wifi,
  Globe,
  Cpu,
  AlertTriangle,
  Eye,
  Zap,
  Server,
  Network,
  Shield,
  Upload,
  Search,
  Users,
  Database,
  Clock
} from "lucide-react";

// Enhanced Matrix Rain with variable characters and colors
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px 'Courier New', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() * 0.7 + 0.3;
        const brightness = Math.random() * 100 + 155;
        ctx.fillStyle = `rgba(0, ${brightness}, 0, ${alpha})`;
        
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60"
    />
  );
};

// Enhanced Radar with pulse effects
const Radar = () => {
  return (
    <div className="absolute top-6 right-6 w-56 h-56">
      <div className="relative w-full h-full">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[30, 60, 90].map((r, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={r}
              stroke="#0f0"
              strokeWidth="1"
              fill="none"
              opacity={0.3}
            />
          ))}
          
          <line x1="100" y1="10" x2="100" y2="190" stroke="#0f0" strokeWidth="1" opacity={0.3} />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#0f0" strokeWidth="1" opacity={0.3} />
          
          <defs>
            <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,0,0)" />
              <stop offset="80%" stopColor="rgba(0,255,0,0.8)" />
              <stop offset="100%" stopColor="rgba(0,255,0,1)" />
            </linearGradient>
          </defs>
          <g transform="translate(100,100)">
            <path
              d="M 0,0 L 90,0 A 90,90 0 0,1 63.64,63.64 Z"
              fill="url(#sweepGrad)"
              style={{
                animation: "sweep 3s linear infinite",
                transformOrigin: "0 0"
              }}
            />
          </g>
          
          <circle cx="130" cy="70" r="2" fill="#ff0000" opacity={0.8}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="140" r="2" fill="#ff6600" opacity={0.8}>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        
        <style jsx>{`
          @keyframes sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

// Network topology visualization
const NetworkMap = () => {
  const nodes = [
    { id: 1, x: 50, y: 50, type: "server", status: "secure" },
    { id: 2, x: 150, y: 80, type: "client", status: "secure" },
    { id: 3, x: 100, y: 120, type: "router", status: "monitoring" },
    { id: 4, x: 200, y: 60, type: "client", status: "threat" },
    { id: 5, x: 80, y: 180, type: "server", status: "secure" }
  ];

  return (
    <div className="bg-black/90 backdrop-blur-md border border-green-500/30 rounded-xl p-4 h-56">
      <h3 className="text-green-300 text-lg mb-3 flex items-center gap-2">
        <Network className="w-5 h-5" />
        Network Topology
      </h3>
      <svg viewBox="0 0 250 200" className="w-full h-full">
        <line x1="50" y1="50" x2="100" y2="120" stroke="#0f0" strokeWidth="1" opacity={0.6} />
        <line x1="150" y1="80" x2="100" y2="120" stroke="#0f0" strokeWidth="1" opacity={0.6} />
        <line x1="200" y1="60" x2="100" y2="120" stroke="#ff0000" strokeWidth="2" opacity={0.8} />
        <line x1="80" y1="180" x2="100" y2="120" stroke="#0f0" strokeWidth="1" opacity={0.6} />
        
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill={node.status === "threat" ? "#ff0000" : 
                   node.status === "monitoring" ? "#ffff00" : "#00ff00"}
              opacity={0.8}
            >
              {node.status === "threat" && (
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
              )}
            </circle>
            <text
              x={node.x}
              y={node.y - 12}
              textAnchor="middle"
              fontSize="8"
              fill="#0f0"
            >
              {node.type}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Terminal-style command line
const TerminalWindow = () => {
  const [commands, setCommands] = useState([]);
  
  useEffect(() => {
    const terminalCommands = [
      { cmd: "nmap -sS 192.168.1.0/24", result: "Host discovery complete" },
      { cmd: "iptables -L", result: "Firewall rules: 247 active" },
      { cmd: "tail -f /var/log/security.log", result: "Monitoring active..." },
      { cmd: "ss -tuln", result: "Network connections analyzed" },
      { cmd: "systemctl status defender", result: "Active: running" }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      const current = terminalCommands[index % terminalCommands.length];
      setCommands(prev => {
        const newCommands = [...prev, current];
        return newCommands.slice(-4);
      });
      index++;
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/90 backdrop-blur-md border border-green-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 border-b border-green-500/20 pb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-green-300 ml-2 text-sm">SECURE TERMINAL</span>
      </div>
      <div className="h-32 overflow-hidden text-xs">
        {commands.map((cmd, i) => (
          <div key={i} className="mb-2">
            <div className="text-green-300">$ {cmd.cmd}</div>
            <div className="text-green-500 ml-2">{cmd.result}</div>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-300">$ </span>
          <div className="w-1 h-3 bg-green-400 ml-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Feed
const ActivityFeed = () => {
  const activities = [
    { time: "14:32:01", event: "Suspicious login attempt blocked", level: "high", source: "Firewall" },
    { time: "14:28:15", event: "SSL certificate renewed successfully", level: "info", source: "System" },
    { time: "14:25:43", event: "Port scan detected from 192.168.1.45", level: "medium", source: "IDS" },
    { time: "14:22:18", event: "System backup completed", level: "info", source: "Backup" }
  ];

  return (
    <div className="bg-black/90 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
      <h3 className="text-green-300 text-lg mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Recent Security Events
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-green-500/20 hover:border-green-400/50 transition-all hover:bg-green-500/5">
            <div className={`w-2 h-2 rounded-full ${
              activity.level === 'high' ? 'bg-red-400 animate-pulse' :
              activity.level === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm text-green-100">{activity.event}</p>
              <p className="text-xs text-green-500">{activity.source}</p>
            </div>
            <div className="text-xs text-green-400 font-mono">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GovOpsCinematic() {
  const [data, setData] = useState({ 
    totalRecords: 245680,
    activeConnections: 156,
    flaggedNumbers: 7,
    uptime: 99.97,
    threats: 3,
    traffic: 1247,
    dataProcessed: 2.4,
    riskScore: 23,
    securityLevel: "HIGH",
    totalCells: 4521,
    activeCells: 4518,
    roamingActive: 89,
    internationalCalls: 234
  });
  const [cinematic, setCinematic] = useState(false);
  const [timeRange, setTimeRange] = useState('24');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [apiConnected] = useState(true);

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);

  // Data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        traffic: prev.traffic + Math.floor(Math.random() * 10) - 5,
        threats: Math.max(0, prev.threats + (Math.random() > 0.95 ? 1 : 0)),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 6) - 3,
        dataProcessed: +(prev.dataProcessed + (Math.random() * 0.2 - 0.1)).toFixed(1),
        riskScore: Math.max(0, Math.min(100, prev.riskScore + Math.floor(Math.random() * 6) - 3))
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const primaryMetrics = [
    {
      icon: Database,
      label: "Total IPDR Records",
      value: data.totalRecords.toLocaleString(),
      subtext: `${data.dataProcessed} GB processed`,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Wifi,
      label: "Active Connections",
      value: data.activeConnections.toLocaleString(),
      subtext: "Real-time monitoring",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: ShieldCheck,
      label: "Flagged Numbers",
      value: data.flaggedNumbers,
      subtext: "Requiring investigation",
      color: data.flaggedNumbers > 5 ? "text-red-400" : "text-yellow-400",
      bgColor: data.flaggedNumbers > 5 ? "bg-red-900/20" : "bg-yellow-900/20",
      borderColor: data.flaggedNumbers > 5 ? "border-red-500/30" : "border-yellow-500/30"
    },
    {
      icon: AlertTriangle,
      label: "Risk Score",
      value: `${data.riskScore}/100`,
      subtext: "Current threat level",
      color: data.riskScore > 50 ? "text-red-400" : "text-yellow-400",
      bgColor: data.riskScore > 50 ? "bg-red-900/20" : "bg-yellow-900/20",
      borderColor: data.riskScore > 50 ? "border-red-500/30" : "border-yellow-500/30"
    }
  ];

  const systemMetrics = [
    {
      icon: Server,
      label: "Total Cell Towers",
      value: data.totalCells.toLocaleString(),
      color: "text-cyan-400"
    },
    {
      icon: Activity,
      label: "Active Cells",
      value: data.activeCells.toLocaleString(),
      color: "text-green-400"
    },
    {
      icon: Globe,
      label: "Roaming Active",
      value: data.roamingActive.toLocaleString(),
      color: "text-blue-400"
    },
    {
      icon: Network,
      label: "International Calls",
      value: data.internationalCalls,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-green-400 font-mono overflow-hidden">
      {cinematic && <MatrixRain />}
      
      {/* Header Section */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-300 mb-2 tracking-wider">
              CYBERSEC OPERATIONS CENTER
            </h1>
            <p className="text-green-500 text-lg mb-1">
              Real-time Security Monitoring & IPDR Analysis
            </p>
            <p className="text-green-400 text-sm">
              Live: {currentTime.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
              <span className={`ml-4 ${apiConnected ? 'text-green-400' : 'text-red-400'}`}>
                • Backend: {apiConnected ? 'Connected' : 'Disconnected'}
              </span>
            </p>
          </div>
          {cinematic && <Radar />}
        </div>

        {/* Time Range Selector & Status */}
        <div className="flex justify-between items-center mb-6 p-4 bg-black/60 rounded-lg border border-green-500/30">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-green-300">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-black/80 border border-green-500/50 rounded px-3 py-1 text-green-400 text-sm focus:border-green-400 focus:outline-none"
            >
              <option value="1">Last 1 Hour</option>
              <option value="6">Last 6 Hours</option>
              <option value="24">Last 24 Hours</option>
              <option value="168">Last 7 Days</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-green-300">SYSTEM ONLINE</span>
            </div>
            <div className="text-green-400">
              Classification: <span className="text-yellow-400 font-bold">CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {primaryMetrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} backdrop-blur-md border ${metric.borderColor} rounded-xl p-6 
                         hover:border-green-400/60 transition-all duration-300 hover:scale-105
                         shadow-lg hover:shadow-green-500/20 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${metric.bgColor} border ${metric.borderColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide mb-1">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color} font-mono mb-1`}>
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">{metric.subtext}</p>
                {metric.label === "Risk Score" && (
                  <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        data.riskScore > 50 ? 'bg-red-400' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${data.riskScore}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TerminalWindow />
          <NetworkMap />
        </div>

        {/* Activity Feed */}
        <div className="mb-8">
          <ActivityFeed />
        </div>

        {/* Network Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systemMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-4 hover:border-green-400/60 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <h4 className="text-sm font-medium text-gray-300">{metric.label}</h4>
              </div>
              <p className={`text-xl font-bold ${metric.color} font-mono`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
          <h3 className="text-green-300 text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-green-500/30 rounded-lg hover:border-green-400 hover:bg-green-500/10 transition-all group text-left">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-medium text-green-100 mb-1">Upload IPDR</h4>
              <p className="text-sm text-green-500">Import new log files for analysis</p>
            </button>
            
            <button className="p-4 border border-green-500/30 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition-all group text-left">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-medium text-green-100 mb-1">Deep Analysis</h4>
              <p className="text-sm text-green-500">Run pattern detection algorithms</p>
            </button>
            
            <button className="p-4 border border-green-500/30 rounded-lg hover:border-purple-400 hover:bg-purple-500/10 transition-all group text-left">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-medium text-green-100 mb-1">Network Map</h4>
              <p className="text-sm text-green-500">Visualize connection patterns</p>
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col gap-3">
        <button
          onClick={() => setCinematic(!cinematic)}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 
                     border-2 backdrop-blur-md ${
            cinematic 
              ? 'bg-red-600/80 hover:bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30'
              : 'bg-green-600/80 hover:bg-green-500 border-green-400 text-black shadow-lg shadow-green-500/30'
          }`}
        >
          {cinematic ? "⚡ EXIT TACTICAL MODE" : "🎯 ENTER TACTICAL MODE"}
        </button>
        
        {cinematic && (
          <div className="flex flex-col gap-2 text-xs text-green-300 bg-black/80 p-3 rounded-lg border border-green-500/30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>Enhanced Monitoring: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Threat Detection: MAXIMUM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Real-time Updates: ON</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      {cinematic && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
