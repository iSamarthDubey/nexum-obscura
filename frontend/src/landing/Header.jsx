import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="bg-[#0D1117] text-[#E0E0E0] shadow-md border-b border-[#00C2FF]/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
       <Link to="/">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-orbitron text-[#00C2FF]"
        >
          Nexum Obscura
        </motion.h1></Link>
        <nav className="flex gap-6 text-sm font-inter">
          {/* <Link to="/home" className="hover:text-[#00C2FF] transition">
            Home
          </Link> */}
          <Link to="/login" className="hover:text-[#00FF85] transition">
            Login
          </Link>
          <Link to="/sign-up" className="hover:text-[#FF4444] transition">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
