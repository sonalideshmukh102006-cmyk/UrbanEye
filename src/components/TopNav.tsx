import { Bus, Activity, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function TopNav() {
  const { 
    activeBuses, cityHealth, criticalAlerts,
    setShowFleetModal, setShowCriticalAlertsModal, setShowCityHealthModal
  } = useStore();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-blue-200 shadow-sm z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">UE</div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800">UrbanEye <span className="font-light text-gray-500 hidden sm:inline">| Central Intelligence</span></h1>
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
