import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// PAGES
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import Navbar from './Navbar'; 

// --- ICONS & HELPERS ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;
const startIcon = new L.Icon({ ...DefaultIcon.options, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' });
const endIcon = new L.Icon({ ...DefaultIcon.options, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png' });
const busIcon = new L.DivIcon({ className: 'custom-bus-icon', html: `<div style="font-size: 30px; line-height: 1; filter: drop-shadow(3px 3px 2px rgba(0,0,0,0.4));">🚌</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });
const crashIcon = new L.DivIcon({ className: 'crash-icon', html: `<div style="font-size: 24px; animation: pulse 1s infinite;">💥</div>`, iconSize: [30, 30] });

// --- DASHBOARD HELPERS ---
function MapResizer() { const map = useMap(); useEffect(() => { map.invalidateSize(); setTimeout(() => map.invalidateSize(), 500); }, [map]); return null; }
function MapController({ path, crashLoc }) { const map = useMap(); useEffect(() => { if (path.length) map.fitBounds(L.latLngBounds(path), { padding: [50,50] }); if (crashLoc) map.flyTo([crashLoc.lat, crashLoc.lon], 14); }, [path, crashLoc, map]); return null; }
function BusSimulator({ path, isRunning }) { const [pos, setPos] = useState(null); useEffect(() => { if (!isRunning || !path.length) return; let i=0; const interval = setInterval(() => { setPos(path[i]); i=(i+1)%path.length; }, 80); return ()=>clearInterval(interval); }, [isRunning, path]); return pos ? <Marker position={pos} icon={busIcon} zIndexOffset={1000} /> : null; }

function Dashboard() {
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedBusIdx, setSelectedBusIdx] = useState("");
  const [availableStops, setAvailableStops] = useState([]);
  const [startStopIdx, setStartStopIdx] = useState("");
  const [endStopIdx, setEndStopIdx] = useState("");
  const [hour, setHour] = useState(9); 
  
  const [resultRoutes, setResultRoutes] = useState([]); 
  const [activeRouteIdx, setActiveRouteIdx] = useState(0); 
  const [crashLocation, setCrashLocation] = useState(null);
  const [isCrashActive, setIsCrashActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState([]);

  useEffect(() => { axios.get('http://127.0.0.1:8000/get-bmtc-routes').then(r => setAllRoutes(r.data)); }, []);
  
  useEffect(() => { 
    if (selectedBusIdx !== "") { 
       setAvailableStops(allRoutes[selectedBusIdx].stops); 
       setStartStopIdx(""); setEndStopIdx(""); setResultRoutes([]); setIntermediateStops([]);
    } 
  }, [selectedBusIdx, allRoutes]);

  const handleOptimize = async (simulateCrash = false) => {
    if (selectedBusIdx === "" || startStopIdx === "" || endStopIdx === "") { alert("Select Bus & Stops"); return; }
    const sIdx = parseInt(startStopIdx);
    const eIdx = parseInt(endStopIdx);
    let stopsToShow = [];
    if (sIdx < eIdx) stopsToShow = availableStops.slice(sIdx + 1, eIdx);
    else if (sIdx > eIdx) stopsToShow = availableStops.slice(eIdx + 1, sIdx);
    setIntermediateStops(stopsToShow);

    setLoading(true); setSimulating(false);
    if (simulateCrash) setIsCrashActive(true); else { setIsCrashActive(false); setCrashLocation(null); }

    try {
      const res = await axios.post('http://127.0.0.1:8000/optimize-route', {
        start_lat: availableStops[sIdx].lat, start_lon: availableStops[sIdx].lon, 
        end_lat: availableStops[eIdx].lat, end_lon: availableStops[eIdx].lon, 
        hour: parseInt(hour), simulate_crash: simulateCrash, target_route_idx: activeRouteIdx
      });
      setResultRoutes(res.data.routes); 
      setCrashLocation(res.data.crash_location);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const activeRoute = resultRoutes[activeRouteIdx];

  // --- DASHBOARD LAYOUT (FIXED: Locked Screen) ---
  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900 text-gray-100 font-sans overflow-hidden flex flex-row">
        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 w-full z-50">
            <Navbar />
        </div>

      {/* Sidebar - FIXED WIDTH */}
      <div className="w-[400px] flex-shrink-0 flex flex-col bg-gray-800 border-r border-gray-700 shadow-2xl z-40 overflow-y-auto p-6 pt-24 h-full">
        <h1 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><span className="text-2xl">⚡</span> AI Transit Control</h1>

        <div className="space-y-4 mb-6">
          <select value={selectedBusIdx} onChange={e => setSelectedBusIdx(e.target.value)} className="w-full bg-gray-700 p-3 rounded border border-gray-600 text-sm"><option value="">-- Choose Bus --</option>{allRoutes.map((r, i) => <option key={i} value={i}>{r.name}</option>)}</select>
          <div className="grid grid-cols-2 gap-2">
             <select value={startStopIdx} onChange={e=>setStartStopIdx(e.target.value)} className="bg-gray-700 p-2 rounded text-xs"><option value="">Start</option>{availableStops.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select>
             <select value={endStopIdx} onChange={e=>setEndStopIdx(e.target.value)} className="bg-gray-700 p-2 rounded text-xs"><option value="">End</option>{availableStops.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select>
          </div>
          <div className="bg-gray-700/30 p-3 rounded border border-gray-600">
             <div className="flex justify-between text-xs text-gray-300 mb-2"><span>Time: <span className="text-blue-400 font-bold">{hour}:00</span></span></div>
             <input type="range" min="0" max="23" value={hour} onChange={e=>setHour(e.target.value)} className="w-full accent-blue-500 h-1" />
             <div className="flex justify-between text-[10px] text-gray-500 mt-1"><span>Low (1-4 PM)</span><span>Peak (9 AM)</span><span>Low (10 PM)</span></div>
          </div>
          <button onClick={() => handleOptimize(false)} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold shadow-lg text-sm">{loading ? "Calculating..." : "Analyze Route"}</button>
        </div>

        {activeRoute && (
          <div className="space-y-3 animate-fade-in pb-20">
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl mb-4">
                <h4 className="text-xs font-bold text-red-400 uppercase mb-2">⚠ Congestion Control</h4>
                {isCrashActive ? (
                     <div className="text-center"><p className="text-sm font-bold text-white mb-2">Crash Active</p><button onClick={() => handleOptimize(false)} className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-xs font-bold uppercase">Reset</button></div>
                ) : (
                    <button onClick={() => handleOptimize(true)} className="w-full py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold uppercase flex items-center justify-center gap-2"><span>💥</span> Simulate Crash</button>
                )}
            </div>
            
            <div className="space-y-2">
               {resultRoutes.map((route, idx) => (
                  <div key={idx} onClick={() => { setActiveRouteIdx(idx); setSimulating(false); }} style={{ borderColor: activeRouteIdx === idx ? route.color : 'transparent' }} className={`p-3 rounded border-2 cursor-pointer transition-all ${activeRouteIdx === idx ? `bg-gray-700` : 'bg-gray-800 border-gray-700'}`}>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase" style={{ color: route.color }}>{route.name}</span><span className="text-sm font-bold text-white">{route.duration} min</span></div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Passenger Load: <b className="text-white">{route.passenger_demand}</b></span>
                        <span>Traffic: <b style={{color: route.color}}>{route.traffic_rating}</b></span>
                    </div>
                  </div>
               ))}
            </div>

            <div className="mt-4 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Carbon Analysis</h4>
               <div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-red-400">Diesel</span><span className="font-bold text-white">{activeRoute.emissions.diesel} kg</span></div>
               <div className="w-full bg-gray-600 h-1.5 rounded mb-3"><div className="bg-red-500 h-1.5 rounded" style={{width: '100%'}}></div></div>
               
               <div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-green-400">Electric (Grid)</span><span className="font-bold text-white">{activeRoute.emissions.ev} kg</span></div>
               <div className="w-full bg-gray-600 h-1.5 rounded mb-3"><div className="bg-green-500 h-1.5 rounded" style={{width: `${(activeRoute.emissions.ev/activeRoute.emissions.diesel)*100}%`}}></div></div>
               
               <div className="text-center pt-2 border-t border-gray-600"><span className="text-[10px] text-blue-400 font-bold uppercase">Net Saved: </span><span className="text-sm font-bold text-white">{activeRoute.emissions.saved} kg</span></div>
            </div>

            <button onClick={()=>setSimulating(true)} className="w-full py-3 bg-white text-gray-900 rounded font-bold text-xs uppercase hover:bg-gray-200 shadow-lg mt-2">{simulating ? "Simulating..." : "▶ Start Simulation"}</button>
          </div>
        )}
      </div>

      {/* Map Container - FLEX GROW to fill remaining space */}
      <div className="flex-1 h-full relative bg-gray-200">
         <MapContainer center={[12.9250, 77.5938]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
            <MapResizer />
            <MapController path={activeRoute?.path || []} crashLoc={crashLocation} />
            {activeRoute && (
                <Polyline 
                    key={`${activeRouteIdx}-${activeRoute.color}-${isCrashActive}`} 
                    positions={activeRoute.path} 
                    pathOptions={{ color: isCrashActive ? '#f59e0b' : activeRoute.color }} 
                    weight={6} 
                    opacity={0.8} 
                />
            )}
            <BusSimulator path={activeRoute?.path || []} isRunning={simulating} />
            {availableStops[startStopIdx] && <Marker position={[availableStops[startStopIdx].lat, availableStops[startStopIdx].lon]} icon={startIcon}><Popup>Start</Popup></Marker>}
            {availableStops[endStopIdx] && <Marker position={[availableStops[endStopIdx].lat, availableStops[endStopIdx].lon]} icon={endIcon}><Popup>End</Popup></Marker>}
            {intermediateStops.map((stop, idx) => <CircleMarker key={idx} center={[stop.lat, stop.lon]} radius={5} pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 1 }}><Popup>{stop.name}</Popup></CircleMarker>)}
            {crashLocation && isCrashActive && <Marker position={[crashLocation.lat, crashLocation.lon]} icon={crashIcon}><Popup>💥 CRASH SITE</Popup></Marker>}
            {activeRoute && activeRoute.hotspots && activeRoute.hotspots.map((spot, i) => (
                <CircleMarker key={`hotspot-${i}`} center={[spot.lat, spot.lon]} radius={spot.count / 8} pathOptions={{ color: '#eab308', fillColor: '#facc15', fillOpacity: 0.6, weight: 0 }}><Popup>👥 {spot.count} Passengers</Popup></CircleMarker>
            ))}
         </MapContainer>
      </div>
    </div>
  );
}

// FIX: Standard Scroll for Home/About, Dashboard Handles its own Lock
export default function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="min-h-screen overflow-auto"><HomePage /></div>} />
        <Route path="/about" element={<div className="min-h-screen overflow-auto"><AboutPage /></div>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  ); 
}