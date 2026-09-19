import { MapPin, ShieldAlert, AlertTriangle, Camera, Waves, AlertCircle, Baseline, Navigation, Columns, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS, MOCK_VIOLATIONS } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function SidebarRight() {
  const navigate = useNavigate();

  const potholes = MOCK_INCIDENTS.filter(i => i.type === 'Pothole');
  const waterLogging = MOCK_INCIDENTS.filter(i => i.type === 'WaterLogging');

  const missingZebra = MOCK_INCIDENTS.filter(i => i.type === 'MissingZebraCrossing');
  const missingSign = MOCK_INCIDENTS.filter(i => i.type === 'MissingSign');
  const brokenDivider = MOCK_INCIDENTS.filter(i => i.type === 'BrokenDivider');

  const { flyTo, setSelectedIncident } = useStore();

  const handleIncidentClick = (incident: any) => {
    flyTo(incident.longitude, incident.latitude, 16);
    setSelectedIncident(incident);
  };

  return (
    <div className="w-full h-full bg-[#FFF9F2] border border-gray-200 flex flex-col shrink-0 shadow-sm overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 p-4 border-b border-gray-200 bg-gray-50 shrink-0">
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          Defect Radar & Infrastructure
        </h1>
      </div>

      <div className="flex flex-col gap-6 p-4">
        
        {/* Defect Radar Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-600" /> Defect Radar
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Potholes Category */}
            <div
              onClick={() => navigate('/defects/Pothole')}
              className="bg-background rounded-xl p-3 border border-border shadow-sm hover:border-yellow-500/50 transition-colors cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/10 p-1.5 rounded-md text-yellow-600 dark:text-yellow-500 h-fit shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Potholes</h3>
                    <p className="text-[10px] text-muted-foreground">{potholes.length} Reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Logging Category */}
            <div
              onClick={() => navigate('/defects/WaterLogging')}
              className="bg-background rounded-xl p-3 border border-border shadow-sm hover:border-blue-500/50 transition-colors cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-600 dark:text-blue-500 h-fit shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Water Logging</h3>
                    <p className="text-[10px] text-muted-foreground">{waterLogging.length} Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/50 shrink-0"></div>

        {/* Infrastructure Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" /> Infrastructure
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Missing Zebra Crossing */}
            <div
              onClick={() => navigate('/defects/MissingZebraCrossing')}
              className="bg-background rounded-xl p-3 border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-md text-primary h-fit shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Baseline className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Missing Zebra Crossing</h3>
                    <p className="text-[10px] text-muted-foreground">{missingZebra.length} Reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Sign Board */}
            <div
              onClick={() => navigate('/defects/MissingSign')}
              className="bg-background rounded-xl p-3 border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-md text-primary h-fit shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Missing Sign Board</h3>
                    <p className="text-[10px] text-muted-foreground">{missingSign.length} Reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Broken Divider */}
            <div
              onClick={() => navigate('/defects/BrokenDivider')}
              className="bg-background rounded-xl p-3 border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-md text-primary h-fit shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Columns className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Broken Divider</h3>
                    <p className="text-[10px] text-muted-foreground">{brokenDivider.length} Reports</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Vehicle Alerts Quick Links at the bottom */}
      <div className="flex gap-3 p-3 border-t border-orange-200/50 bg-gradient-to-b from-[#FFF9F2] to-orange-50/30 sticky bottom-0 shrink-0 z-10">
        <button 
          onClick={() => window.open('/vehicle-alerts', '_blank')}
          className="w-1/3 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 text-[11px] sm:text-xs font-black py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-2 hover:from-orange-100 hover:to-orange-200 transition-all shadow-sm text-center border border-orange-200 shrink-0 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-500/10 scale-0 group-hover:scale-150 rounded-full transition-transform duration-500 ease-out"></div>
          <AlertCircle className="w-7 h-7 text-orange-600 group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10 leading-tight">VEHICLE<br/>ALERTS</span>
        </button>
        <div className="w-2/3 flex flex-col gap-2 overflow-hidden justify-between">
          {MOCK_VIOLATIONS.slice(0, 3).map((v, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-orange-100/80 rounded-lg p-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-orange-50 transition-colors group"
              onClick={() => { flyTo(v.longitude, v.latitude, 16); setSelectedIncident(v); }}
            >
               <div className="flex items-center gap-2.5 overflow-hidden">
                 <div className={`w-2 h-2 rounded-full shrink-0 ${v.severity === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>
                 <div className="flex flex-col overflow-hidden gap-0.5">
                   <span className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-700 transition-colors">{v.type}</span>
                   <span className="text-[10px] text-gray-500 truncate">{v.vehicleNo}</span>
                 </div>
               </div>
               <span className={`text-[10px] px-2 py-1 rounded-md font-bold shrink-0 ${v.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                 {v.time}
               </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
