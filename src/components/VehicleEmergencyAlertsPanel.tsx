import { AlertCircle, Activity, Zap, ExternalLink, ArrowLeft } from 'lucide-react';
import { MOCK_VIOLATIONS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function VehicleEmergencyAlertsPanel() {
  const navigate = useNavigate();
  const { setSelectedIncident } = useStore();
  const emergencyViolations = MOCK_VIOLATIONS.filter(v => v.severity === 'Critical' || v.severity === 'High');

  return (
    <div className="w-full min-h-[400px] max-h-[600px] bg-[#FFF9F2] border border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
      <div className="flex flex-col gap-1 p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
          <button 
            onClick={() => navigate('/')} 
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <AlertCircle className="w-4 h-4 text-orange-600" /> Vehicle Emergency Alerts
        </h2>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-orange-200 pl-8 gap-4">
          {emergencyViolations.map((violation) => (
            <div 
              key={violation.id} 
              onClick={() => setSelectedIncident(violation)}
              className="relative bg-white rounded-xl p-3 border border-orange-200 shadow-sm group hover:border-orange-500/50 transition-colors cursor-pointer"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[27px] top-4 w-2 h-2 rounded-full ring-4 ring-amber-50 ${violation.severity === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>

              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${violation.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {violation.severity === 'Critical' && <Zap className="w-3 h-3" />}
                  {violation.type}
                </span>
                <span className="text-xs font-bold text-gray-600">{violation.time}</span>
              </div>

              <div className="text-sm font-bold text-gray-800 mb-1">
                Vehicle: <span className="font-mono text-blue-600">{violation.vehicleNo}</span>
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">
                Loc: {violation.location} <br />
                ID: {violation.id} • Source: {violation.bus}
                {violation.confidenceScore && (
                  <span className="block text-[10px] text-green-600 font-medium mt-0.5">
                    ANPR Confidence: {violation.confidenceScore}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Reports Button */}
        <button
          onClick={() => navigate('/reports')}
          className="mt-4 w-full py-2 bg-white hover:bg-orange-100/50 border border-orange-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors"
        >
          View All Reports <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
