import { X, Bus, AlertTriangle, Eye, ShieldAlert, Clock, ArrowLeft, Camera, CheckCircle2, CheckCircle, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MOCK_BUSES, MOCK_INCIDENTS } from '../data/mockData';

export default function TopNavModals() {
  const { 
    showFleetModal, setShowFleetModal, 
    showCriticalAlertsModal, setShowCriticalAlertsModal,
    showFleetOnMap, setShowFleetOnMap,
    investigationIncident, setInvestigationIncident,
    flyTo,
    showCityHealthModal, setShowCityHealthModal, cityHealth
  } = useStore();

  const criticalAlerts = MOCK_INCIDENTS.filter(i => i.severity === 'Critical');

  const handleShowFleetOnMap = () => {
    setShowFleetOnMap(!showFleetOnMap);
  };

  return (
    <>
      {/* Active Fleet Modal */}
      {showFleetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-100/50 dark:bg-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Active Fleet Tracker</h2>
                  <p className="text-xs text-muted-foreground">{MOCK_BUSES.length} Vehicles Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShowFleetOnMap}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-colors border ${showFleetOnMap ? 'bg-blue-500 text-white border-blue-500' : 'bg-background text-foreground border-border hover:bg-muted'}`}
                >
                  <Eye className="w-4 h-4" />
                  {showFleetOnMap ? 'Hide on Map' : 'Show on Map'}
                </button>
                <button 
                  onClick={() => setShowFleetModal(false)}
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_BUSES.map(bus => (
                  <div key={bus.id} className="p-4 rounded-xl border border-border bg-background flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Bus className="w-4 h-4 text-blue-500" /> {bus.id}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bus.delay > 5 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                        {bus.delay > 5 ? `Delayed ${bus.delay}m` : 'On Time'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">Route: <span className="text-foreground font-medium">{bus.route}</span></div>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => {
                          flyTo(bus.longitude, bus.latitude, 16);
                          setShowFleetOnMap(true);
                          setShowFleetModal(false);
                        }}
                        className="text-xs font-bold text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-colors w-full"
                      >
                        Locate on Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City Health Modal */}
      {showCityHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-green-500/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">City Health Index</h2>
                  <p className="text-xs text-muted-foreground">Overall Score: {cityHealth}/100</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCityHealthModal(false)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                  <span className="font-semibold text-sm">Traffic Congestion</span>
                  <span className="font-bold text-green-500">25/30</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                  <span className="font-semibold text-sm">Infrastructure Maintenance</span>
                  <span className="font-bold text-green-500">20/25</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                  <span className="font-semibold text-sm">Public Safety</span>
                  <span className="font-bold text-green-500">20/25</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                  <span className="font-semibold text-sm">Environmental Quality</span>
                  <span className="font-bold text-green-500">20/20</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Scores are calculated in real-time based on live data feeds from active fleet cameras, sensor data, and current incident reports.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alerts Modal */}
      {showCriticalAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-destructive/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Critical Alerts</h2>
                  <p className="text-xs text-muted-foreground">{criticalAlerts.length} Actionable Events requiring immediate attention</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCriticalAlertsModal(false)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              <div className="flex flex-col gap-4">
                {criticalAlerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-4">
                    <div className="p-2 rounded bg-destructive/10 text-destructive mt-1">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{alert.type}</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {alert.time || 'Just now'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Location: {alert.locationName}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setInvestigationIncident(alert);
                        setShowCriticalAlertsModal(false);
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
                    >
                      Investigate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Modal */}
      {investigationIncident && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setInvestigationIncident(null);
                  }}
                  className="p-1 hover:bg-black/5 rounded transition-colors text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Investigation: {investigationIncident.type}</h2>
                  <p className="text-xs text-gray-500">{investigationIncident.locationName}</p>
                </div>
              </div>
              <button 
                onClick={() => setInvestigationIncident(null)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Timeline */}
            <div className="p-6 overflow-y-auto bg-slate-50 flex flex-col gap-6">
              
              {/* Step 1: Reported */}
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center z-10 shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 absolute top-8 left-4 -translate-x-1/2"></div>
                </div>
                <div className="flex-1 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">Initial Report</h3>
                    <span className="text-xs text-gray-500">{investigationIncident.time}</span>
                  </div>
                  {investigationIncident.imageUrl && (
                    <img src={investigationIncident.imageUrl} alt="Initial incident" className="w-full h-48 object-cover rounded-lg mb-3" />
                  )}
                  <p className="text-sm text-gray-600">{investigationIncident.description}</p>
                  <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">Reported By: {investigationIncident.source}</p>
                </div>
              </div>

              {/* Step 2: Verification */}
              {investigationIncident.verifyingBusId && (
                <div className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 absolute top-8 left-4 -translate-x-1/2"></div>
                  </div>
                  <div className="flex-1 bg-white border border-blue-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Status Verified
                      </h3>
                      <p className="text-sm text-blue-600 mt-1 max-w-[250px]">Incident presence confirmed by passing transit vehicle. No duplicate photo needed.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Verified By</p>
                      <p className="font-black text-blue-700">{investigationIncident.verifyingBusId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Resolution / Pending */}
              {investigationIncident.status === 'Resolved' && investigationIncident.resolvedImageUrl ? (
                <div className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center z-10 shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-green-200 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-green-800">Incident Resolved</h3>
                      <div className="flex items-center gap-2">
                        {investigationIncident.resolutionScore && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-black tracking-wider border border-emerald-200">
                            SCORE: {investigationIncident.resolutionScore}/100
                          </span>
                        )}
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-black uppercase tracking-wider">Cleared</span>
                      </div>
                    </div>
                    <img src={investigationIncident.resolvedImageUrl} alt="Resolved state" className="w-full h-48 object-cover rounded-lg mb-3" />
                    <p className="text-sm text-green-700">The incident has been cleared and traffic flow is restored.</p>
                    <p className="text-xs text-green-600 mt-2 font-bold uppercase tracking-wider">Verified By: {investigationIncident.resolvedByBusId}</p>
                  </div>
                </div>
              ) : investigationIncident.verifyingBusId ? (
                <div className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center z-10 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-dashed border-orange-200 p-4 rounded-xl shadow-sm opacity-70">
                    <h3 className="font-bold text-orange-800">Pending Resolution</h3>
                    <p className="text-sm text-orange-600 mt-1">This incident is yet to be resolved. Awaiting final verification.</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center z-10 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-dashed border-slate-200 p-4 rounded-xl shadow-sm opacity-70">
                    <h3 className="font-bold text-slate-800">Pending Verification & Resolution</h3>
                    <p className="text-sm text-slate-600 mt-1">This incident is yet to be verified by a passing vehicle. Awaiting updates.</p>
                  </div>
                </div>
              )}

            </div>
            
            {/* Footer Removed */}
          </div>
        </div>
      )}
    </>
  );
}
