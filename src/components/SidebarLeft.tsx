import { useState } from 'react';
import { AlertCircle, AlertTriangle, ChevronRight, Activity, Zap, ExternalLink, Users, Search } from 'lucide-react';
import { MOCK_TRAFFIC_CORRIDORS, MOCK_VIOLATIONS, MOCK_CROWD_HOTSPOTS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function SidebarLeft() {
  const navigate = useNavigate();
  const { setSelectedIncident } = useStore();
  const [corridorSearch, setCorridorSearch] = useState('');
  const [crowdSearch, setCrowdSearch] = useState('');
  const [showCorridorModal, setShowCorridorModal] = useState(false);
  const [showCrowdModal, setShowCrowdModal] = useState(false);

  const filteredCorridors = MOCK_TRAFFIC_CORRIDORS.filter(c => c.name.toLowerCase().includes(corridorSearch.toLowerCase()));
  const filteredHotspots = MOCK_CROWD_HOTSPOTS.filter(h => h.name.toLowerCase().includes(crowdSearch.toLowerCase()));
  
  const CorridorCard = ({ corridor }: { corridor: any }) => (
    <div key={corridor.id} className="bg-background rounded-xl p-3 border border-border hover:border-primary/50 transition-colors group cursor-pointer shrink-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{corridor.name}</h3>
          <p className="text-xs text-muted-foreground">{corridor.status} • Delay: {corridor.delay} • Source: {corridor.sourceBus} ({corridor.lastUpdatedMinutesAgo}m ago)</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vehicle Density</span>
        <span className={`text-xs font-bold ${corridor.density > 75 ? 'text-destructive' : corridor.density > 50 ? 'text-orange-500' : 'text-green-500'}`}>
          {corridor.density}%
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${corridor.density > 75 ? 'bg-destructive' : corridor.density > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
          style={{ width: `${corridor.density}%` }}
        ></div>
      </div>
      
      {corridor.lastUpdatedMinutesAgo && corridor.lastUpdatedMinutesAgo >= 30 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 leading-tight">
          <span className="font-bold">Warning:</span> Data may be stale. No bus ({corridor.sourceBus}) has passed from this location in the last half hour. Showing info from {corridor.lastUpdatedMinutesAgo} mins ago.
        </div>
      )}
    </div>
  );

  const HotspotCard = ({ hotspot }: { hotspot: any }) => (
    <div key={hotspot.id} className="bg-background rounded-xl p-3 border border-border hover:border-purple-500/50 transition-colors group cursor-pointer flex flex-col gap-2 relative overflow-hidden shrink-0">
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
      <div className="flex justify-between items-center z-10">
        <span className="text-sm font-bold text-foreground">{hotspot.name}</span>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
          hotspot.density > 85 ? 'bg-red-500/10 text-red-500' :
          hotspot.density > 60 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {hotspot.density > 85 ? 'Critical' : hotspot.density > 60 ? 'High' : 'Moderate'}
        </span>
      </div>
      <div className="flex justify-between items-end z-10">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Est. Crowd Count</span>
          <span className="text-lg font-black text-foreground leading-none">{hotspot.count.toLocaleString()}</span>
          <span className="text-[9px] text-muted-foreground mt-1">Source: {hotspot.sourceBus} ({hotspot.lastUpdatedMinutesAgo}m ago)</span>
        </div>
        <div className="text-xs font-bold text-purple-500 flex items-center gap-1">
            {hotspot.density}% Full
        </div>
      </div>

      {hotspot.lastUpdatedMinutesAgo && hotspot.lastUpdatedMinutesAgo >= 30 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 leading-tight z-10 relative">
          <span className="font-bold">Warning:</span> Data may be stale. No bus ({hotspot.sourceBus}) has passed from this location in the last half hour. Showing info from {hotspot.lastUpdatedMinutesAgo} mins ago.
        </div>
      )}
    </div>
  );
  // Filter to show only high-priority emergencies
  const emergencyViolations = MOCK_VIOLATIONS.filter(v => v.severity === 'Critical' || v.severity === 'High');

  return (
    <div className="w-full h-full bg-[#FFF9F2] border border-gray-200 flex flex-col shrink-0 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          Traffic & Mobility Intelligence
        </h1>
      </div>

      {/* Top Bottlenecks Featured Section */}
      <div className="p-4 bg-red-50/50 border-b border-red-100 shrink-0">
        <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" /> Top Choke Points
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_TRAFFIC_CORRIDORS
            .filter(c => c.density > 85 || c.status === 'Gridlock')
            .slice(0, 2)
            .map(c => (
              <div key={`choke-${c.id}`} className="bg-white rounded-lg p-3 border border-red-200 shadow-sm flex items-center justify-between hover:border-red-400 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-bold text-red-700 text-sm">{c.name}</h3>
                  <p className="text-xs text-red-600/80 mt-0.5">Expected Clearance: ~30 mins</p>
                </div>
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                  +{c.delay} delay
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        
        {/* Active Corridors */}
        <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Active Corridors
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search area in Pune..." 
            value={corridorSearch}
            onChange={(e) => setCorridorSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3">
          {filteredCorridors.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
              No data available for this area.
            </div>
          ) : (
            filteredCorridors.slice(0, 3).map(corridor => (
              <CorridorCard key={corridor.id} corridor={corridor} />
            ))
          )}
          
          {filteredCorridors.length > 3 && (
            <button 
              onClick={() => setShowCorridorModal(true)}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors"
            >
              View All Corridors
            </button>
          )}
        </div>
      </div>

      {/* Crowd Density Permanent Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" /> Live Crowd Density
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search area in Pune..." 
            value={crowdSearch}
            onChange={(e) => setCrowdSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Hotspots List */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {filteredHotspots.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
              No data available for this area.
            </div>
          ) : (
            filteredHotspots.slice(0, 3).map(hotspot => (
              <HotspotCard key={hotspot.id} hotspot={hotspot} />
            ))
          )}

          {filteredHotspots.length > 3 && (
            <button 
              onClick={() => setShowCrowdModal(true)}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors mt-2"
            >
              View All Crowd Data
            </button>
          )}
        </div>
      </div>
      
      {/* End Grid Container */}
      </div>

      {/* Corridor Modal */}
      {showCorridorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <button onClick={() => setShowCorridorModal(false)} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> All Corridors
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
               {filteredCorridors.map(corridor => (
                 <CorridorCard key={corridor.id} corridor={corridor} />
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Crowd Modal */}
      {showCrowdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <button onClick={() => setShowCrowdModal(false)} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" /> All Crowd Data
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
               {filteredHotspots.map(hotspot => (
                 <HotspotCard key={hotspot.id} hotspot={hotspot} />
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
