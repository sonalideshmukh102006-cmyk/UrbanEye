import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import DashboardHome from './pages/DashboardHome';
import FullscreenMap from './pages/FullscreenMap';
import AllReports from './pages/AllReports';
import DefectList from './pages/DefectList';
import IncidentModal from './components/IncidentModal';
import CorridorStatsModal from './components/CorridorStatsModal';
import TopNavModals from './components/TopNavModals';
import { telemetryWS } from './services/websocket';

function App() {
  useEffect(() => {
    // Initiate WebSocket connection to Central Ingest Server
    telemetryWS.connect();
    return () => {
      telemetryWS.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden font-sans">
        <TopNav />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/map" element={<FullscreenMap />} />
          <Route path="/reports" element={<AllReports />} />
          <Route path="/defects/:type" element={<DefectList />} />
        </Routes>
        <IncidentModal />
        <CorridorStatsModal />
        <TopNavModals />
      </div>
    </BrowserRouter>
  );
}

export default App;
