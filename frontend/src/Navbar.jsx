import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Hash Scrolling
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleNav = (hash) => {
    if (location.pathname !== '/about') {
      navigate(`/about${hash}`);
    } else {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkClass = (path) => 
    `cursor-pointer text-sm font-medium transition-colors duration-200 ${location.pathname === path ? "text-blue-400" : "text-gray-400 hover:text-white"}`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f111a]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">BMTCTransit<span className="text-blue-500">AI</span></span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <button onClick={() => handleNav('#methodology')} className={linkClass('/about')}>Methodology</button>
        <button onClick={() => handleNav('#sdg')} className={linkClass('/about')}>SDG Goals</button>
        <Link to="/about" className={linkClass('/about')}>About Project</Link>
        <Link to="/dashboard" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-900/20">
          Launch App
        </Link>
      </div>
    </nav>
  );
}