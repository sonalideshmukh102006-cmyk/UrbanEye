import { X, Map, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MOCK_OD_FLOWS } from '../data/mockData';

interface Props {
  onClose: () => void;
}

export default function ODAnalysisModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Origin-Destination (O-D) Analysis</h2>
              <p className="text-xs text-gray-500">Live Travel Demand Patterns</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-white flex flex-col gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>O-D Matrix Insights:</strong> This data tracks the volume of commuters moving between major city nodes. Identifying high-demand O-D pairs helps optimize transit routes and predict downstream congestion before it occurs.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Highest Demand Corridors (Live)</h3>
            <div className="flex flex-col gap-3">
              {MOCK_OD_FLOWS.map(flow => (
                <div key={flow.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors bg-slate-50/50">
                  
                  {/* Route */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 bg-white border border-gray-100 rounded px-3 py-2 text-sm font-bold text-gray-800 shadow-sm">
                      {flow.origin}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1 bg-white border border-gray-100 rounded px-3 py-2 text-sm font-bold text-gray-800 shadow-sm">
                      {flow.destination}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Vol (Veh/Hr)</span>
                      <span className="text-lg font-black text-gray-900">{flow.volume.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-px h-8 bg-gray-200"></div>
                    
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Trend</span>
                      <span className="flex items-center gap-1 text-sm font-bold mt-0.5">
                        {flow.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {flow.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-green-500" />}
                        {flow.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                        <span className={flow.trend === 'increasing' ? 'text-red-500' : flow.trend === 'decreasing' ? 'text-green-500' : 'text-gray-500'}>
                          {flow.trend.charAt(0).toUpperCase() + flow.trend.slice(1)}
                        </span>
                      </span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
