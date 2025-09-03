

const DEMO_USERNAME = "DemoOfficer@NexumObscura";
const DEMO_PASSWORD = "ObscuraCollective";

const OfficerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const handleCopy = (type) => {
    const value = type === "username" ? DEMO_USERNAME : DEMO_PASSWORD;
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Direct demo login (no backend)
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem('authToken', 'demo-token');
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center cyber-bg"
      style={{ fontFamily: "Fira Mono, monospace" }}
    >
      <div className="flex flex-col md:flex-row bg-[#18181b] rounded-xl shadow-2xl overflow-hidden border border-cyan-700 cyber-glow">
        {/* Animated accent bar */}
        <div className="hidden md:block w-2 bg-gradient-to-b from-cyan-400 via-cyan-700 to-cyan-900 animate-pulse" />
        {/* Terminal-style login form */}
        <div className="p-8 flex-1 flex flex-col justify-center relative">
          <h2 className="text-cyan-400 text-3xl font-bold mb-6 tracking-wide cyber-title-glow">
            Officer Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-cyan-300 mb-2 font-mono">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black text-cyan-200 border border-cyan-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-lg cyber-input-glow"
                autoComplete="username"
                placeholder="Enter your officer username"
              />
            </div>
            <div>
              <label className="block text-cyan-300 mb-2 font-mono">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black text-cyan-200 border border-cyan-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-lg cyber-input-glow"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm font-mono cyber-error-glow">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded transition cyber-btn-glow font-mono text-lg"
            >
              Login
            </button>
          </form>
          {/* Decorative terminal border */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-2 border-cyan-800 rounded-xl cyber-terminal-border" />
        </div>
        {/* Demo credentials box */}
        <div className="bg-black/80 border-l border-cyan-800 p-8 flex flex-col justify-center items-center min-w-[260px] cyber-sidebox-glow">
          <h3 className="text-cyan-400 text-xl font-semibold mb-4 font-mono cyber-title-glow">
            Demo Credentials
          </h3>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded cyber-cred-row-glow">
              <span className="text-cyan-300 font-mono">Username:</span>
              <span className="text-cyan-100 font-mono">{DEMO_USERNAME}</span>
              <button
                className="ml-2 px-2 py-1 bg-cyan-700 text-xs text-white rounded hover:bg-cyan-600 cyber-btn-glow"
                onClick={() => handleCopy("username")}
              >
                {copied === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded cyber-cred-row-glow">
              <span className="text-cyan-300 font-mono">Password:</span>
              <span className="text-cyan-100 font-mono">{DEMO_PASSWORD}</span>
              <button
                className="ml-2 px-2 py-1 bg-cyan-700 text-xs text-white rounded hover:bg-cyan-600 cyber-btn-glow"
                onClick={() => handleCopy("password")}
              >
                {copied === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="mt-6 text-xs text-cyan-400 text-center font-mono">
            Click to copy demo credentials and login to the dashboard.
          </div>
        </div>
      </div>
    </div>

  );
};

export default OfficerLogin;


import React, { useState } from 'react';

