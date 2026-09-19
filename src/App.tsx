import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import TopNav from './components/TopNav';
import DashboardHome from './pages/DashboardHome';
import FullscreenMap from './pages/FullscreenMap';
import AllReports from './pages/AllReports';
import DefectList from './pages/DefectList';
import IncidentModal from './components/IncidentModal';
import CorridorStatsModal from './components/CorridorStatsModal';
import TopNavModals from './components/TopNavModals';
import ActionCenter from './components/ActionCenter';
import VehicleEmergencyAlertsPanel from './components/VehicleEmergencyAlertsPanel';

function App() {
  // Dark mode removed


  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden font-sans">
        <TopNav />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/map" element={<FullscreenMap />} />
          <Route path="/reports" element={<AllReports />} />
          <Route path="/defects/:type" element={<DefectList />} />
          <Route path="/action-center" element={<div className="flex-1 overflow-auto bg-gray-50 p-4"><ActionCenter /></div>} />
          <Route path="/vehicle-alerts" element={<div className="flex-1 overflow-auto bg-gray-50 p-4"><VehicleEmergencyAlertsPanel /></div>} />
        </Routes>
        <IncidentModal />
        <CorridorStatsModal />
        <TopNavModals />
      </div>
    </BrowserRouter>
  );
}

export default App;
