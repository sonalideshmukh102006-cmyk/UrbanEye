import { Bus, Activity, AlertTriangle, Radio } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function TopNav() {
  const {
    activeBuses, cityHealth, criticalAlerts, isServerConnected,
    setShowFleetModal, setShowCriticalAlertsModal, setShowCityHealthModal
  } = useStore();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-blue-200 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center shadow-md overflow-hidden border border-cyan-800/50">
          <img src="/11.png" alt="Sahasrāksha Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col justify-center ml-3 mt-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 leading-none drop-shadow-sm uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SAHASRĀKSHA
          </h1>
          <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-700/90 uppercase hidden sm:block mt-1">
            Central Intelligence
          </span>
        </div>

        {/* Live Server Ingest Status Indicator */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${isServerConnected
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
          : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}>
          <Radio className={`w-3.5 h-3.5 ${isServerConnected ? 'animate-pulse text-emerald-600' : 'text-amber-600'}`} />
          <span>{isServerConnected ? 'Live Edge Connected' : 'Protoype - Seeded Data'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div
            onClick={() => setShowFleetModal(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Bus className="w-5 h-5 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Fleet</span>
              <span className="font-bold text-gray-800 leading-none">{activeBuses}</span>
            </div>
          </div>
          <div
            onClick={() => setShowCityHealthModal(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Activity className="w-5 h-5 text-green-500" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">City Health</span>
              <span className="font-bold text-gray-800 leading-none">{cityHealth}/100</span>
            </div>
          </div>
          <div
            onClick={() => setShowCriticalAlertsModal(true)}
            className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-md border border-red-200 cursor-pointer hover:bg-red-200 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Critical Alerts</span>
              <span className="font-bold text-red-700 leading-none">{criticalAlerts} Active</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
      </div>
    </header>
  );
}
