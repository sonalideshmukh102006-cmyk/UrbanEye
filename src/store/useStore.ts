import { create } from 'zustand';
import { MOCK_BUSES } from '../data/mockData';

export interface DashboardState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeBuses: number;
  cityHealth: number;
  criticalAlerts: number;
  selectedIncident: any | null;
  returnUrl: string | null;
  investigationIncident: any | null;
  setSelectedIncident: (incident: any | null) => void;
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
  returnUrl: null,
  investigationIncident: null,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
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
  
  mapLayers: {
    vehicleDensity: false,
    liveFleet: false,
    crowdDensity: false,
    infrastructure: false,
    defectRadar: false,
    emergency: false,
    vehicleAlerts: false,
    liveBottlenecks: false,
    pedestrianSafety: false,
  },
  toggleMapLayer: (layer) => set((state) => ({
    mapLayers: {
      ...state.mapLayers,
      [layer]: !state.mapLayers[layer]
    }
  })),

}));
