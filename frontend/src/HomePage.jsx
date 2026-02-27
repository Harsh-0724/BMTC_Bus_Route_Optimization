import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0c15] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* HERO SECTION */}
      <main className="relative pt-32 pb-16 px-6 flex flex-col items-center justify-center min-h-screen text-center overflow-hidden">
        
        {/* Background Glow Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Live Prototype v1.0
        </div>

        {/* Main Headline */}
        <h1 className="max-w-5xl mx-auto text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up delay-100">
          Optimizing Transit for a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Sustainable Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-10 animate-fade-in-up delay-200">
          An AI-driven solution reducing urban congestion and carbon emissions. Aligning with 
          <strong className="text-white"> SDG 9 & 11</strong> to create resilient infrastructure through dynamic route optimization.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
            Launch Dashboard <span>→</span>
          </Link>
          <Link to="/about" className="px-8 py-4 bg-[#1a1d2d] hover:bg-[#25293d] text-white border border-white/5 rounded-lg font-semibold text-lg transition-all">
            View Documentation
          </Link>
        </div>

        {/* FEATURE CARDS (Bottom Row) */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto w-full animate-fade-in-up delay-500">
          <FeatureCard 
            icon="🌿" 
            title="Carbon Reduction" 
            desc="Real-time emission tracking comparing Diesel vs Electric fleets per route."
          />
          <FeatureCard 
            icon="📊" 
            title="Demand Prediction" 
            desc="LSTM-powered passenger forecasting to optimize bus frequency."
          />
          <FeatureCard 
            icon="🗺️" 
            title="Dynamic Routing" 
            desc="Graph-based traffic avoidance logic reroutes buses instantly."
          />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>&copy; 2026 BMTCTransit AI. Built for the Future of Bangalore.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 bg-[#131620] border border-white/5 rounded-xl text-left hover:border-blue-500/30 transition-all group">
      <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}