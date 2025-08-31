import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Clock, MapPin, Camera, Phone, Users, AlertTriangle, 
  Play, Pause, RotateCcw, Eye, Download, Zap, Target, 
  Shield, TrendingUp, Search, Filter, Maximize2, Activity 
} from 'lucide-react';

const CrimeReconstructionAI = () => {
  const canvasRef = useRef(null);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionProgress, setReconstructionProgress] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [correlationMap, setCorrelationMap] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [reconstructionData, setReconstructionData] = useState(null);
  const [viewMode, setViewMode] = useState('3d_scene');
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    initializeEvidenceData();
    generateTimelineEvents();
  }, []);

  // 3D Scene Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId;
    let time = 0;

    const animate = () => {
      // Dark crime scene background
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
      );
      gradient.addColorStop(0, 'rgba(30, 30, 50, 0.9)');
      gradient.addColorStop(1, 'rgba(10, 10, 20, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw crime scene grid
      ctx.strokeStyle = 'rgba(0, 255, 200, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Evidence markers
      const evidencePoints = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, type: 'phone', important: true },
        { x: canvas.width * 0.7, y: canvas.height * 0.4, type: 'location', important: false },
        { x: canvas.width * 0.5, y: canvas.height * 0.6, type: 'call', important: true },
        { x: canvas.width * 0.3, y: canvas.height * 0.7, type: 'movement', important: false },
        { x: canvas.width * 0.8, y: canvas.height * 0.2, type: 'contact', important: true }
      ];

      evidencePoints.forEach((point, i) => {
        const pulse = Math.sin(time * 3 + i) * 5;
        const size = point.important ? 12 + pulse : 8 + pulse * 0.5;
        
        // Evidence glow
        const glowGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size + 15);
        glowGradient.addColorStop(0, point.important ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 200, 255, 0.6)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size + 15, 0, Math.PI * 2);
        ctx.fill();

        // Evidence marker
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = point.important ? '#FF6B6B' : '#4ECDC4';
        ctx.fill();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Evidence label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(point.type.toUpperCase(), point.x, point.y - size - 8);
      });

      // Connection lines between evidence
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < evidencePoints.length - 1; i++) {
        const from = evidencePoints[i];
        const to = evidencePoints[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Data flow animation
        const progress = (time + i) % 2 / 2;
        const flowX = from.x + (to.x - from.x) * progress;
        const flowY = from.y + (to.y - from.y) * progress;
        
        ctx.beginPath();
        ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFF00';
        ctx.fill();
      }

      // Reconstruction scan effect
      if (isReconstructing) {
        const scanRadius = (time * 100) % (canvas.width + 200);
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, scanRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 150, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Secondary scan
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, scanRadius - 50, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 150, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isReconstructing]);

  const initializeEvidenceData = () => {
    const evidence = [
      {
        id: 1,
        type: 'IPDR_LOG',
        timestamp: new Date('2024-03-15T14:30:00'),
        location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai Central' },
        parties: ['+919876543210', '+919876543211'],
        confidence: 94,
        significance: 'high',
        details: 'Call initiated during known criminal activity window'
      },
      {
        id: 2,
        type: 'CELL_TOWER',
        timestamp: new Date('2024-03-15T14:35:00'),
        location: { lat: 19.0825, lng: 72.8811, name: 'Tower ID: MH01-2847' },
        parties: ['+919876543210'],
        confidence: 89,
        significance: 'medium',
        details: 'Suspect moved to secondary location during call'
      },
      {
        id: 3,
        type: 'PATTERN_MATCH',
        timestamp: new Date('2024-03-15T14:40:00'),
        location: { lat: 19.0760, lng: 72.8777, name: 'Pattern Analysis' },
        parties: ['+919876543210', '+919876543212', '+919876543213'],
        confidence: 87,
        significance: 'critical',
        details: 'Multi-party coordination pattern matches known criminal methodology'
      }
    ];
    setCorrelationMap(evidence);
  };

  const generateTimelineEvents = () => {
    const events = [
      { time: '14:25', event: 'Initial Contact', type: 'communication', status: 'confirmed' },
      { time: '14:30', event: 'Primary Call Initiated', type: 'call', status: 'confirmed' },
      { time: '14:32', event: 'Location Change Detected', type: 'movement', status: 'confirmed' },
      { time: '14:35', event: 'Secondary Contact', type: 'communication', status: 'confirmed' },
      { time: '14:38', event: 'Stress Indicators Rise', type: 'behavioral', status: 'ai_detected' },
      { time: '14:40', event: 'Group Coordination', type: 'network', status: 'confirmed' },
      { time: '14:42', event: 'Operational Planning', type: 'planning', status: 'ai_predicted' },
      { time: '14:45', event: 'Expected Action Window', type: 'prediction', status: 'ai_predicted' }
    ];
    setTimelineEvents(events);
  };

  const startReconstruction = () => {
    setIsReconstructing(true);
    setReconstructionProgress(0);
    
    const interval = setInterval(() => {
      setReconstructionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReconstructing(false);
          generateReconstructionData();
          return 100;
        }
        return prev + Math.random() * 8 + 3;
      });
    }, 200);
  };

  const generateReconstructionData = () => {
    setReconstructionData({
      scenario: 'Coordinated Criminal Operation',
      probability: 91,
      keyFindings: [
        'Primary suspect orchestrated 4-party coordination',
        'Location movement suggests planned meetup',
        'Communication patterns indicate urgency and secrecy',
        'Timeline suggests operation planned for next 24-48 hours'
      ],
      evidenceCorrelation: 94,
      missingEvidence: [
        'Financial transaction data needed',
        'CCTV footage from target locations',
        'Additional phone records from 14:45-15:00 window'
      ],
      recommendedActions: [
        'Immediate surveillance at predicted locations',
        'Monitor all associated phone numbers',
        'Coordinate with financial crimes unit',
        'Prepare intervention team'
      ]
    });
  };

  const playTimelineReconstruction = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-600 text-white',
      ai_detected: 'bg-blue-600 text-white',
      ai_predicted: 'bg-purple-600 text-white'
    };
    return colors[status] || 'bg-gray-600 text-white';
  };

  const getTypeIcon = (type) => {
    const icons = {
      communication: Phone,
      call: Phone,
      movement: MapPin,
      behavioral: Brain,
      network: Users,
      planning: Target,
      prediction: TrendingUp
    };
    return icons[type] || Clock;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg shadow-cyan-500/50">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crime Scene Reconstruction AI
            </h1>
            <p className="text-sm text-white/70">Real-Time Evidence Correlation & Scene Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className="bg-black/60 border border-white/30 rounded-lg px-3 py-2 text-sm backdrop-blur-sm"
          >
            <option value="3d_scene">3D Scene Reconstruction</option>
            <option value="evidence_map">Evidence Correlation Map</option>
            <option value="timeline_flow">Timeline Flow Analysis</option>
            <option value="predictive_model">Predictive Modeling</option>
          </select>
          
          <button
            onClick={startReconstruction}
            disabled={isReconstructing}
            className="px-6 py-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 rounded-lg font-bold flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-pink-500/30"
          >
            {isReconstructing ? <Brain className="h-4 w-4 animate-pulse" /> : <Zap className="h-4 w-4" />}
            <span>{isReconstructing ? 'Reconstructing...' : 'Start Reconstruction'}</span>
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Evidence Database */}
        <div className="w-80 bg-black/40 backdrop-blur-sm border-r border-white/20 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-bold text-cyan-400 mb-4 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Evidence Database</span>
            </h2>
            
            <div className="space-y-3">
              {correlationMap.map(evidence => (
                <div
                  key={evidence.id}
                  onClick={() => setSelectedEvidence(evidence)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedEvidence?.id === evidence.id
                      ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{evidence.type.replace('_', ' ')}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      evidence.significance === 'critical' ? 'bg-red-600' :
                      evidence.significance === 'high' ? 'bg-orange-600' : 'bg-blue-600'
                    }`}>
                      {evidence.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-2">{evidence.details}</p>
                  <div className="flex items-center space-x-3 text-xs text-white/60">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{evidence.timestamp.toLocaleTimeString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{evidence.location.name}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Evidence Stream */}
            <div className="mt-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-3">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Live Evidence Stream</span>
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['New IPDR log detected', 'Location correlation found', 'Pattern match identified', 'Behavioral anomaly spotted'].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white/80">{item}</span>
                    <span className="text-white/50 ml-auto">now</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - 3D Reconstruction */}
        <div className="flex-1 relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          
          {/* Reconstruction Progress Overlay */}
          {isReconstructing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 border border-purple-500/50 rounded-2xl p-8 max-w-lg shadow-2xl shadow-purple-500/20">
                <div className="text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto border-4 border-purple-500 rounded-full animate-spin border-t-transparent border-r-transparent"></div>
                    <div className="w-20 h-20 absolute top-2 left-1/2 transform -translate-x-1/2 border-4 border-cyan-500 rounded-full animate-spin border-b-transparent border-l-transparent"></div>
                    <Target className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-400 mb-2">AI Crime Scene Reconstruction</h3>
                  <p className="text-sm text-white/70">Analyzing evidence correlation and reconstructing criminal sequence</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reconstruction Progress</span>
                    <span className="text-purple-400 font-mono">{Math.round(reconstructionProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${reconstructionProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className={`flex items-center space-x-2 transition-colors ${reconstructionProgress > 20 ? 'text-green-400' : 'text-white/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${reconstructionProgress > 20 ? 'bg-green-500' : 'bg-white/30'}`}></div>
                    <span>Correlating IPDR data with location intelligence</span>
                  </div>
                  <div className={`flex items-center space-x-2 transition-colors ${reconstructionProgress > 40 ? 'text-green-400' : 'text-white/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${reconstructionProgress > 40 ? 'bg-green-500' : 'bg-white/30'}`}></div>
                    <span>Analyzing temporal relationships and causality</span>
                  </div>
                  <div className={`flex items-center space-x-2 transition-colors ${reconstructionProgress > 60 ? 'text-green-400' : 'text-white/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${reconstructionProgress > 60 ? 'bg-green-500' : 'bg-white/30'}`}></div>
                    <span>Building 3D crime scene model</span>
                  </div>
                  <div className={`flex items-center space-x-2 transition-colors ${reconstructionProgress > 80 ? 'text-green-400' : 'text-white/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${reconstructionProgress > 80 ? 'bg-green-500' : 'bg-white/30'}`}></div>
                    <span>Generating predictive scenarios</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Playback Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-white/30 rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={playTimelineReconstruction}
                className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs">Timeline:</span>
                <div className="w-48 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{width: `${(playbackTime / (timelineEvents.length - 1)) * 100}%`}}
                  ></div>
                </div>
                <span className="text-xs font-mono">{playbackTime + 1}/{timelineEvents.length}</span>
              </div>
              
              <button
                onClick={() => setPlaybackTime(0)}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Current Event Display */}
          {timelineEvents[playbackTime] && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 min-w-80">
              <div className="text-center">
                <h3 className="font-bold text-cyan-400 mb-2">Current Event Analysis</h3>
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(timelineEvents[playbackTime].status)}`}>
                    {React.createElement(getTypeIcon(timelineEvents[playbackTime].type), { className: "h-4 w-4" })}
                  </div>
                  <div>
                    <p className="font-semibold">{timelineEvents[playbackTime].event}</p>
                    <p className="text-xs text-white/70">{timelineEvents[playbackTime].time} - {timelineEvents[playbackTime].status.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Reconstruction Results */}
        <div className="w-96 bg-black/40 backdrop-blur-sm border-l border-white/20 overflow-y-auto">
          <div className="p-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">94%</div>
                <div className="text-xs text-white/70">Evidence Correlation</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">91%</div>
                <div className="text-xs text-white/70">Scenario Probability</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">7</div>
                <div className="text-xs text-white/70">Evidence Points</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">24h</div>
                <div className="text-xs text-white/70">Critical Window</div>
              </div>
            </div>

            {/* Reconstruction Results */}
            {reconstructionData && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border border-emerald-500/30 rounded-lg p-4">
                  <h3 className="font-bold text-emerald-400 mb-3 flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Reconstructed Scenario</span>
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-white/70">Scenario:</span>
                      <p className="text-emerald-300 font-semibold">{reconstructionData.scenario}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Key Findings:</span>
                      <ul className="text-white/90 mt-2 space-y-1">
                        {reconstructionData.keyFindings.map((finding, i) => (
                          <li key={i} className="text-xs flex items-start space-x-2">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full mt-2"></div>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-lg p-4">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Critical Actions Required</span>
                  </h3>
                  <div className="space-y-2">
                    {reconstructionData.recommendedActions.map((action, i) => (
                      <div key={i} className="bg-black/40 p-2 rounded border border-red-500/20">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-white/90">{action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Missing Evidence</span>
                  </h3>
                  <div className="space-y-2">
                    {reconstructionData.missingEvidence.map((missing, i) => (
                      <div key={i} className="text-xs text-white/80 flex items-center space-x-2">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span>{missing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Events */}
            <div className="mt-6">
              <h3 className="font-bold text-blue-400 mb-3 flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Event Timeline</span>
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {timelineEvents.map((event, i) => {
                  const IconComponent = getTypeIcon(event.type);
                  const isActive = i === playbackTime && isPlaying;
                  return (
                    <div key={i} className={`p-2 rounded border transition-all ${
                      isActive 
                        ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/20' 
                        : 'border-white/20 bg-white/5'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${getStatusColor(event.status)}`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{event.event}</p>
                          <div className="flex items-center space-x-2 text-xs text-white/60">
                            <span>{event.time}</span>
                            <span>•</span>
                            <span className="capitalize">{event.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-t border-white/20 p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Reconstruction Engine: Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Evidence Correlation: 94.7%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Prediction Accuracy: 91.2%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded font-medium flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>Export Reconstruction</span>
            </button>
            <button className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded font-medium flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Deploy Team</span>
            </button>
            <span className="text-white/50">Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeReconstructionAI;
