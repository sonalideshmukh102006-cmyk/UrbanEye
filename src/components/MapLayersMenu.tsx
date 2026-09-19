import { Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function MapLayersMenu() {
  const { mapLayers, toggleMapLayer } = useStore();

  return (
    <div className="h-full flex flex-col bg-[#FFF9F2] border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 p-4 pb-3 border-b border-gray-200 bg-gray-50">
        <Layers className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-800 tracking-wide">Map Layers</h3>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto p-4">
        {[
          { id: 'pedestrianSafety', label: 'Unsafe Zone For Pedestrians' },
          { id: 'liveBottlenecks', label: 'Live Bottlenecks (Gridlocks)' },
          { id: 'vehicleDensity', label: 'Vehicle Density' },
          { id: 'liveFleet', label: 'Live Fleet (Buses)' },
          { id: 'crowdDensity', label: 'Crowd Density' },
          { id: 'infrastructure', label: 'Infrastructure (Signs/Lines)' },
          { id: 'defectRadar', label: 'Defect Radar (Potholes & WaterLogging)' },
          { id: 'emergency', label: 'Emergency (Cave-ins/Trees)' },
          { id: 'vehicleAlerts', label: 'Vehicle Alerts (Violations)' }
        ].map(layer => (
          <label key={layer.id} className="flex items-center justify-between cursor-pointer group gap-4">
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{layer.label}</span>
            <button
              onClick={() => toggleMapLayer(layer.id as any)}
              className={`w-9 h-5 rounded-full transition-colors relative shadow-inner shrink-0 ${mapLayers[layer.id as keyof typeof mapLayers] ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${mapLayers[layer.id as keyof typeof mapLayers] ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}
