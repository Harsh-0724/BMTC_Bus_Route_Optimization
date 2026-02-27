import React from 'react';
import Navbar from './Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0c15] text-gray-100 font-sans pt-20">
      <Navbar />
      
      {/* Container - Added generous bottom padding to ensure scrollability */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-24 pb-32">
        
        {/* HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white">Project Mission</h1>
          <p className="text-xl text-gray-400">Optimizing Urban Mobility for the 21st Century.</p>
        </section>

        {/* THE PROBLEM */}
        <section className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">The Challenge</h2>
          <p className="text-gray-300 leading-relaxed">
            Bangalore is infamous for its traffic congestion. Traditional bus routes are static—they follow the same path regardless of whether it's 2 AM or 9 AM peak hour. 
            This leads to delays, wasted fuel, and frustrated passengers. Furthermore, the transition to Electric Vehicles (EVs) requires data-driven justification.
          </p>
        </section>

        {/* METHODOLOGY SECTION */}
        <section id="methodology" className="scroll-mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">01. Dynamic Pathfinding</h2>
            <p className="text-gray-400 leading-relaxed">
              We utilize <strong className="text-white">Dijkstra's Algorithm</strong> enriched with real-time traffic weights. Unlike standard GPS, our system applies a 
              <span className="text-yellow-400"> "Gridlock Penalty"</span> to main highways during peak hours (9 AM / 6 PM), mathematically forcing the algorithm to discover "Rat Runs" (side streets) that are otherwise ignored.
            </p>
          </div>
          <div className="p-6 bg-[#131620] border border-white/10 rounded-xl">
             <div className="font-mono text-xs text-green-400 leading-loose">
                &gt; Initializing Graph (OSMnx)...<br/>
                &gt; Fetching Traffic Data... [PEAK HOUR DETECTED]<br/>
                &gt; Applying 15x Penalty to Highways...<br/>
                &gt; Recalculating Optimal Path...<br/>
                &gt; <span className="text-blue-400">New Route Found: +12% Efficiency</span>
             </div>
          </div>
        </section>

        {/* SDG SECTION */}
        <section id="sdg" className="scroll-mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 p-6 bg-[#131620] border border-white/10 rounded-xl grid grid-cols-2 gap-4 text-center">
             <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">SDG 9</div>
                <div className="text-xs text-orange-200">Industry, Innovation & Infrastructure</div>
             </div>
             <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-3xl font-bold text-green-500 mb-2">SDG 11</div>
                <div className="text-xs text-green-200">Sustainable Cities & Communities</div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">02. UN SDG Alignment</h2>
            <p className="text-gray-400 leading-relaxed">
              Our project directly targets <strong>Target 11.2</strong>: Providing access to safe, affordable, accessible and sustainable transport systems. By prioritizing EV buses and reducing idle time in traffic, we lower the urban carbon footprint.
            </p>
          </div>
        </section>

        {/* NEW SECTION: SYSTEM ARCHITECTURE */}
        <section className="space-y-6">
           <h2 className="text-2xl font-bold text-pink-400">03. System Architecture</h2>
           <div className="p-8 bg-[#131620] border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-2">
                 <h3 className="text-white font-bold">Frontend Layer</h3>
                 <p className="text-sm text-gray-500">React.js • Leaflet • Tailwind</p>
                 <div className="text-xs text-gray-600">User Interaction & Visualization</div>
              </div>
              <div className="text-2xl text-gray-600">→</div>
              <div className="space-y-2">
                 <h3 className="text-white font-bold">API Gateway</h3>
                 <p className="text-sm text-gray-500">FastAPI • Pydantic</p>
                 <div className="text-xs text-gray-600">Request Validation & Routing</div>
              </div>
              <div className="text-2xl text-gray-600">→</div>
              <div className="space-y-2">
                 <h3 className="text-white font-bold">Core Engine</h3>
                 <p className="text-sm text-gray-500">NetworkX • TensorFlow • OSMnx</p>
                 <div className="text-xs text-gray-600">Graph Processing & AI Inference</div>
              </div>
           </div>
        </section>

        {/* NEW SECTION: FUTURE ROADMAP */}
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-300">04. Future Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="text-2xl mb-2">📡</div>
                    <h3 className="font-bold text-white mb-2">IoT Integration</h3>
                    <p className="text-sm text-gray-400">Connecting directly to GPS trackers on physical BMTC buses for live data.</p>
                </div>
                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="text-2xl mb-2">📱</div>
                    <h3 className="font-bold text-white mb-2">Passenger App</h3>
                    <p className="text-sm text-gray-400">A mobile app for commuters to see the live crowd levels and ETA.</p>
                </div>
                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="text-2xl mb-2">🤖</div>
                    <h3 className="font-bold text-white mb-2">Reinforcement Learning</h3>
                    <p className="text-sm text-gray-400">Moving from Dijkstra to RL agents that "learn" traffic patterns over time.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}