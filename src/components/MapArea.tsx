import { useState, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../store/useStore';
import { MOCK_BUSES, MOCK_INCIDENTS, MOCK_TRAFFIC_CORRIDORS, MOCK_CROWD_HOTSPOTS, MOCK_VIOLATIONS } from '../data/mockData';
import { Bus, AlertTriangle, AlertCircle, Info, Maximize2, Search, ArrowLeft, Layers, Zap, Car, MapPin, LocateFixed, Users, Droplets, CircleDot } from 'lucide-react';

const OSM_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export default function MapArea({ isFullscreen = false }: { isFullscreen?: boolean }) {
  const { theme, mapViewport, onMapMove, setSelectedIncident, setSelectedCorridor, mapLayers, toggleMapLayer } = useStore();
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const allLocationsObj: Record<string, { name: string, lat: number, lng: number }> = {};
  
  MOCK_INCIDENTS.forEach(i => {
    if (i.locationName) allLocationsObj[i.locationName] = { name: i.locationName, lat: i.latitude, lng: i.longitude };
  });
  MOCK_VIOLATIONS.forEach(v => {
    if (v.location) allLocationsObj[v.location] = { name: v.location, lat: v.latitude, lng: v.longitude };
  });
  MOCK_TRAFFIC_CORRIDORS.forEach(t => {
    allLocationsObj[t.name] = { name: t.name, lat: t.coordinates[0][1], lng: t.coordinates[0][0] };
  });
  MOCK_CROWD_HOTSPOTS.forEach(h => {
    allLocationsObj[h.name] = { name: h.name, lat: h.latitude, lng: h.longitude };
  });

  const allSearchableLocations = Object.values(allLocationsObj);

  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setGlobalSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setGlobalSearchResults(data.map((item: any) => ({
            name: item.display_name.split(',')[0],
            subName: item.display_name.split(',').slice(1).join(',').trim(),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          })));
          setIsSearching(false);
        })
        .catch(err => {
          console.error(err);
          setIsSearching(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const mockSearchResults = searchQuery.trim().length > 0 
    ? allSearchableLocations
        .filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(loc => ({ ...loc, subName: 'Pune, Maharashtra' }))
    : [];

  const searchResults = [...mockSearchResults, ...globalSearchResults].slice(0, 6);

  const handleSelectResult = (loc: any) => {
    mapRef.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 16, duration: 1500 });
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo({ center: [73.8567, 18.5204], zoom: 13, duration: 1500 });
  };

  const getIncidentIcon = (severity: string, type?: string) => {
    if (type === 'Pothole') {
      return (
        <div className="bg-neutral-800 text-amber-500 p-1.5 rounded-full shadow-lg border-2 border-white">
          <CircleDot className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'WaterLogging') {
      return (
        <div className="bg-blue-900 text-blue-200 p-1.5 rounded-full shadow-lg border-2 border-white">
          <Droplets className="w-5 h-5" />
        </div>
      );
    }
    
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-6 h-6 text-red-500 fill-red-500/20 animate-pulse" />;
      case 'High': return <AlertCircle className="w-5 h-5 text-orange-500 fill-orange-500/20" />;
      case 'Medium': return <Info className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
      default: return <div className="w-3 h-3 rounded-full bg-blue-50 ring-2 ring-white/50" />;
    }
  };

  const interactiveLayerIds = mapLayers.vehicleDensity 
    ? MOCK_TRAFFIC_CORRIDORS.map(c => `layer-${c.id}`)
    : [];

  const handleMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature && feature.layer.id.startsWith('layer-TC-')) {
      const corridorId = feature.layer.id.replace('layer-', '');
      const corridor = MOCK_TRAFFIC_CORRIDORS.find(c => c.id === corridorId);
      if (corridor) {
        setSelectedCorridor(corridor);
      }
    }
  };

  // Map styles are kept default for light mode

  return (
    <div className="absolute inset-0">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        {isFullscreen && (
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-card text-foreground px-4 py-2 rounded-lg shadow-lg border border-border hover:bg-muted pointer-events-auto transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        )}
        <div className="relative pointer-events-auto">
          {/* Google Maps Style Search Bar */}
          <div className={`flex items-center bg-white text-gray-800 shadow-md transition-all duration-200 ${isFocused && (searchResults.length > 0 || searchQuery.length > 0) ? 'rounded-t-3xl rounded-b-none border-b border-gray-100' : 'rounded-full'} p-1.5 pl-3 w-80 sm:w-96`}>
            <Search className="w-5 h-5 text-gray-600 ml-2 mr-3" />
            <input 
              type="text" 
              placeholder="Search here" 
              className="bg-transparent border-none outline-none w-full text-[15px] placeholder:text-gray-500 py-1.5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
          </div>
          
          {/* Google Maps Style Search Results Dropdown */}
          {isFocused && (searchResults.length > 0 || searchQuery.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-md border-t-0 overflow-hidden z-50 pb-2">
              {searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleSelectResult(result)}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="text-gray-400 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[15px] text-gray-800 truncate">{result.name}</span>
                      <span className="text-[13px] text-gray-500 truncate">{result.subName || 'Location'}</span>
                    </div>
                  </div>
                ))
              ) : searchQuery.length > 0 ? (
                <div className="px-5 py-4 text-center text-gray-500 text-sm">
                  {isSearching ? 'Searching worldwide...' : 'No locations found'}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-auto flex flex-col gap-2">
        {!isFullscreen && (
          <button 
            onClick={() => navigate('/map')}
            className="p-2 bg-card text-foreground rounded-lg shadow-lg border border-border hover:bg-muted transition-colors"
            title="Open Fullscreen Map"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <button 
          onClick={handleRecenter}
          className="p-2 bg-card text-foreground rounded-lg shadow-lg border border-border hover:bg-muted transition-colors bg-white"
          title="Recenter to Pune"
        >
          <LocateFixed className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <Map
        ref={mapRef}
        {...mapViewport}
        onMove={evt => onMapMove(evt.viewState)}
        onClick={handleMapClick}
        interactiveLayerIds={interactiveLayerIds}
        mapStyle={OSM_STYLE as any}
        attributionControl={false}
        cursor={interactiveLayerIds.length > 0 ? 'pointer' : 'grab'}
      >
        <NavigationControl position="bottom-right" />

        {mapLayers.liveFleet && MOCK_BUSES.map(bus => (
          <Marker key={bus.id} longitude={bus.longitude} latitude={bus.latitude} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-md mb-1 ${
                bus.delay > 10 ? 'bg-red-500 text-white' : 
                bus.delay > 0 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {bus.id}
              </div>
              <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-200">
                <Bus className="w-4 h-4 text-slate-800" />
              </div>
            </div>
          </Marker>
        ))}

        {MOCK_INCIDENTS.map(incident => {
          const isInfra = ['MissingSign', 'MissingZebraCrossing', 'BrokenDivider'].includes(incident.type);
          const isDefect = ['Pothole', 'WaterLogging'].includes(incident.type);
          const isEmergency = ['FallenTree', 'RoadCaveIn', 'Crash'].includes(incident.type);
          const isPedestrian = incident.type === 'VulnerablePedestrian';
          
          if (isInfra && !mapLayers.infrastructure) return null;
          if (isDefect && !mapLayers.defectRadar) return null;
          if (isEmergency && !mapLayers.emergency) return null;
          if (isPedestrian && !mapLayers.pedestrianSafety) return null;

          return (
            <Marker key={incident.id} longitude={incident.longitude} latitude={incident.latitude} anchor="bottom">
              <div className="cursor-pointer transition-transform hover:scale-125" onClick={() => setSelectedIncident(incident)}>
                {isPedestrian ? (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-16 h-16 bg-amber-500/30 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '2s' }}></div>
                    <div className="relative bg-amber-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white z-10">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                ) : (
                  getIncidentIcon(incident.severity, incident.type)
                )}
              </div>
            </Marker>
          );
        })}

        {/* Vehicle Alerts (Violations) */}
        {mapLayers.vehicleAlerts && MOCK_VIOLATIONS.map((violation, idx) => (
          violation.longitude && violation.latitude ? (
            <Marker key={violation.id || idx} longitude={violation.longitude} latitude={violation.latitude} anchor="bottom">
              <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110" onClick={() => setSelectedIncident(violation)}>
                <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-pulse">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </Marker>
          ) : null
        ))}

        {/* Traffic Corridors */}
        {mapLayers.vehicleDensity && MOCK_TRAFFIC_CORRIDORS.map(corridor => {
          const color = corridor.density > 80 ? '#ef4444' : corridor.density > 50 ? '#f97316' : '#22c55e';
          return (
            <Source 
              key={corridor.id} 
              id={corridor.id} 
              type="geojson" 
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: corridor.coordinates
                }
              }}
            >
              {/* Outline Layer for better visibility against light map */}
              <Layer 
                id={`layer-outline-${corridor.id}`}
                type="line"
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round'
                }}
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 10,
                  'line-opacity': 0.7
                }}
              />
              {/* Core Route Layer */}
              <Layer 
                id={`layer-${corridor.id}`}
                type="line"
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round'
                }}
                paint={{
                  'line-color': color,
                  'line-width': 6,
                  'line-opacity': 1
                }}
              />
            </Source>
          );
        })}

        {/* Crowd Density Heatmap Layer */}
        {mapLayers.crowdDensity && (
          <Source
            id="crowd-hotspots"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: MOCK_CROWD_HOTSPOTS.map(h => ({
              type: 'Feature',
              properties: { density: h.density, name: h.name },
              geometry: { type: 'Point', coordinates: [h.longitude, h.latitude] }
            }))
          }}
        >
          <Layer
            id="crowd-heat"
            type="heatmap"
            paint={{
              'heatmap-weight': ['interpolate', ['linear'], ['get', 'density'], 0, 0, 100, 1],
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(34, 197, 94, 0)',
                0.4, 'rgba(34, 197, 94, 0.8)',
                0.7, 'rgba(249, 115, 22, 0.8)',
                1, 'rgba(239, 68, 68, 1)'
              ],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 15, 15, 40],
              'heatmap-opacity': 0.85
            }}
          />
        </Source>
        )}

        {/* Live Bottlenecks Layer */}
        {mapLayers.liveBottlenecks && MOCK_TRAFFIC_CORRIDORS
          .filter(c => c.density > 85 || c.status === 'Gridlock')
          .map(c => (
            <Marker key={`bottleneck-${c.id}`} longitude={c.coordinates[0][0]} latitude={c.coordinates[0][1]} anchor="center">
              <div className="relative flex items-center justify-center cursor-pointer group">
                <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></div>
                <div className="absolute w-12 h-12 bg-red-500/40 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '1.5s' }}></div>
                <div className="relative bg-red-600 border-2 border-white text-white p-2 rounded-full shadow-2xl z-10 group-hover:scale-110 transition-transform flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 bg-white text-gray-900 text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 z-20">
                  <p className="text-red-600 uppercase tracking-wider mb-0.5">Critical Bottleneck</p>
                  <p className="text-sm">{c.name}</p>
                  <p className="text-gray-500 mt-1">Impact: <span className="text-red-600">+{c.delay} delay</span></p>
                </div>
              </div>
            </Marker>
          ))
        }
      </Map>
    </div>
  );
}
