import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Truck, Car, Bike, Activity, Clock, Navigation } from 'lucide-react';

export default function CorridorStatsModal() {
  const { selectedCorridor, setSelectedCorridor } = useStore();

  if (!selectedCorridor) return null;

  const stats = selectedCorridor.vehicleStats;
  const isHighCongestion = selectedCorridor.density > 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header section with back button */}
        <div className="flex items-center p-5 border-b border-gray-100 bg-white">
          <button 
            onClick={() => setSelectedCorridor(null)}
            className="mr-4 p-1 hover:bg-gray-100 rounded transition-colors flex items-center text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedCorridor.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isHighCongestion ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {selectedCorridor.status}
              </span>
              <span className="text-[11px] text-gray-600 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> {selectedCorridor.lastUpdatedMinutesAgo} mins ago
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto bg-white">
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-center shadow-sm">
              <div className="text-[11px] text-gray-600 mb-2 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" /> Traffic Density
              </div>
              <div className="text-3xl font-black text-gray-900">
                {selectedCorridor.density}%
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-center shadow-sm relative">
              <div className="text-[11px] text-gray-600 mb-2 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5" /> Est. Delay
              </div>
              <div className={`text-3xl font-black ${isHighCongestion ? 'text-red-600' : 'text-orange-500'}`}>
                +{selectedCorridor.delay}
              </div>
              <div className="mt-3 text-[9px] text-gray-400 leading-tight">
                *Computed using live density ({selectedCorridor.density}%) × base route speed, adjusted for incidents.
              </div>
            </div>
          </div>

          {/* @ts-ignore */}
          {selectedCorridor.bottleneckReason && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Bottleneck Report
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                <p className="text-sm text-gray-800 font-medium">
                  {/* @ts-ignore */}
                  {selectedCorridor.bottleneckReason}
                </p>
                {/* @ts-ignore */}
                {selectedCorridor.proofImageUrl && (
                  <img 
                    // @ts-ignore
                    src={selectedCorridor.proofImageUrl}
                    alt="Bottleneck Proof"
                    className="w-full h-32 object-cover rounded-lg border border-red-200 shadow-inner"
                  />
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Vehicle Classification
            </h3>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {stats ? (
            <div className="space-y-3">
              {/* Heavy Vehicles */}
              <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-4 shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Heavy Vehicles</h4>
                  <p className="text-[11px] text-gray-500">Trucks, JCB, Tankers</p>
                </div>
                <div className="text-2xl font-black text-gray-900">{stats.heavy}</div>
              </div>

              {/* 4-Wheelers */}
              <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mr-4 shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">4-Wheelers</h4>
                  <p className="text-[11px] text-gray-500">Cars, Buses, Vans</p>
                </div>
                <div className="text-2xl font-black text-gray-900">{stats.fourWheeler}</div>
              </div>

              {/* 2-Wheelers */}
              <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mr-4 shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">2-Wheelers</h4>
                  <p className="text-[11px] text-gray-500">Bikes, Scooters, Bicycles</p>
                </div>
                <div className="text-2xl font-black text-gray-900">{stats.twoWheeler}</div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              Classification data not available for this corridor.
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}
