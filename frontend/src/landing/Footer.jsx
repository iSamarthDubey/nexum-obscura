import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0D1117] border-t border-[#00C2FF]/30 text-[#E0E0E0] py-6 text-center font-inter">
      <p className="mb-2">
        © {new Date().getFullYear()} Nexum Obscura — All Rights Reserved
      </p>
      <div className="flex justify-center gap-6 text-sm">
        <a href="#privacy" className="hover:text-[#00C2FF] transition">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-[#00FF85] transition">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
