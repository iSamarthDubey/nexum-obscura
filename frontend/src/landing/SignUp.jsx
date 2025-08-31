import { motion } from "framer-motion";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("✅ Account created! Please login.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    <Header/>

    
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#161B22] shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#00FF85]/30"
      >
        <h2 className="text-3xl font-orbitron text-center text-[#00FF85] mb-6">
          Sign Up
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0D1117] border border-[#00FF85]/30 text-[#E0E0E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00FF85]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0D1117] border border-[#00FF85]/30 text-[#E0E0E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00FF85]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#0D1117] border border-[#00FF85]/30 text-[#E0E0E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00FF85]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00FF85] hover:bg-[#00FF85]/80 text-black font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        {error && (
          <p className="text-red-400 text-center mt-3">{error}</p>
        )}
        <p className="text-sm text-center text-[#E0E0E0]/70 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#00C2FF] hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>

    <Footer/>
    </>
  );
};

export default SignUp;
