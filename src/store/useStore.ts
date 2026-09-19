import { create } from 'zustand';
import { MOCK_BUSES, MOCK_INCIDENTS, type BusLocation } from '../data/mockData';


export interface DashboardState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeBuses: number;
  cityHealth: number;
  criticalAlerts: number;
  selectedIncident: any | null;
  selectedCorridor: any | null;
  returnUrl: string | null;
  investigationIncident: any | null;
  setSelectedIncident: (incident: any | null) => void;
  setSelectedCorridor: (corridor: any | null) => void;
  setReturnUrl: (url: string | null) => void;
  setInvestigationIncident: (incident: any | null) => void;
  mapViewport: { longitude: number; latitude: number; zoom: number; pitch: number; transitionDuration?: number };
  flyTo: (longitude: number, latitude: number, zoom?: number) => void;
  onMapMove: (viewport: any) => void;
  
  dashboardScrollY: number;
  setDashboardScrollY: (y: number) => void;
  
  showFleetModal: boolean;
  setShowFleetModal: (show: boolean) => void;
  showCriticalAlertsModal: boolean;
  setShowCriticalAlertsModal: (show: boolean) => void;
  showCityHealthModal: boolean;
  setShowCityHealthModal: (show: boolean) => void;

  // Server & Live Telemetry State
  isServerConnected: boolean;
  setServerConnected: (connected: boolean) => void;
  liveBuses: BusLocation[];
  liveEvents: any[];
  handleLiveTelemetryEvent: (eventData: any) => void;
  
  mapLayers: {
    vehicleDensity: boolean;
    liveFleet: boolean;
    crowdDensity: boolean;
    infrastructure: boolean;
    defectRadar: boolean;
    emergency: boolean;
    vehicleAlerts: boolean;
    liveBottlenecks: boolean;
    pedestrianSafety: boolean;
  };
  toggleMapLayer: (layer: keyof DashboardState['mapLayers']) => void;
}

export const useStore = create<DashboardState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  activeBuses: MOCK_BUSES.length,
  cityHealth: 85,
  criticalAlerts: 3,
  
  selectedIncident: null,
  selectedCorridor: null,
  returnUrl: null,
  investigationIncident: null,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  setSelectedCorridor: (corridor) => set({ selectedCorridor: corridor }),
  setReturnUrl: (url) => set({ returnUrl: url }),
  setInvestigationIncident: (incident) => set({ investigationIncident: incident }),

  dashboardScrollY: 0,
  setDashboardScrollY: (y) => set({ dashboardScrollY: y }),
  
  mapViewport: {
    longitude: 73.8567,
    latitude: 18.5204,
    zoom: 13,
    pitch: 45,
  },
  onMapMove: (viewport) => set({ mapViewport: viewport }),
  flyTo: (longitude, latitude, zoom = 15) => set((state) => ({
    mapViewport: {
      ...state.mapViewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1500,
    }
  })),

  showFleetModal: false,
  setShowFleetModal: (show) => set({ showFleetModal: show }),
  showCriticalAlertsModal: false,
  setShowCriticalAlertsModal: (show) => set({ showCriticalAlertsModal: show }),
  showCityHealthModal: false,
  setShowCityHealthModal: (show) => set({ showCityHealthModal: show }),
  
  isServerConnected: false,
  setServerConnected: (connected) => set({ isServerConnected: connected }),
  liveBuses: MOCK_BUSES,
  liveEvents: MOCK_INCIDENTS,

  handleLiveTelemetryEvent: (eventData) => set((state) => {
    // 1. If location update, update bus position
    if (eventData.event_type === 'BusLocationUpdate') {
      const existingIdx = state.liveBuses.findIndex(b => b.id === eventData.bus_id);
      let updatedBuses = [...state.liveBuses];
      if (existingIdx >= 0) {
        updatedBuses[existingIdx] = {
          ...updatedBuses[existingIdx],
          longitude: eventData.longitude,
          latitude: eventData.latitude,
        };
      } else {
        updatedBuses.push({
          id: eventData.bus_id,
          route: `Route ${eventData.location_name || 'Central'}`,
          longitude: eventData.longitude,
          latitude: eventData.latitude,
          delay: 0,
        });
      }
      return {
        liveBuses: updatedBuses,
        activeBuses: updatedBuses.length,
      };
    }

    // 2. Otherwise it's a defect / emergency incident event
    const newIncident = {
      id: eventData.uuid.substring(0, 8).toUpperCase(),
      type: eventData.event_type,
      severity: eventData.severity || 'Medium',
      longitude: eventData.longitude,
      latitude: eventData.latitude,
      description: eventData.description || `${eventData.event_type} detected`,
      locationName: eventData.location_name || 'Pune Central',
      status: 'Unverified',
      source: `${eventData.bus_id} Cam`,
      time: 'Just now',
      imageUrl: eventData.image_url,
      croppedImageUrl: eventData.cropped_image_url,
      verifyingBusId: eventData.verifying_bus_id || eventData.bus_id,
    };

    // Add to MOCK_INCIDENTS array as well for existing components
    if (!MOCK_INCIDENTS.some(i => i.id === newIncident.id)) {
      MOCK_INCIDENTS.unshift(newIncident as any);
    }

    const updatedEvents = [newIncident, ...state.liveEvents];
    const isCritical = eventData.severity === 'Critical' || eventData.severity === 'High';

    return {
      liveEvents: updatedEvents,
      criticalAlerts: isCritical ? state.criticalAlerts + 1 : state.criticalAlerts,
    };
  }),

  mapLayers: {
    vehicleDensity: false,
    liveFleet: true,
    crowdDensity: false,
    infrastructure: false,
    defectRadar: true,
    emergency: true,
    vehicleAlerts: true,
    liveBottlenecks: false,
    pedestrianSafety: true,
  },
  toggleMapLayer: (layer) => set((state) => ({
    mapLayers: {
      ...state.mapLayers,
      [layer]: !state.mapLayers[layer]
    }
  })),

}));
