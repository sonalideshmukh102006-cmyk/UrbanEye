import { useEffect, useRef } from 'react';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import MapArea from '../components/MapArea';
import AnalyticsPanel from '../components/AnalyticsPanel';
import MapLayersMenu from '../components/MapLayersMenu';
import { useStore } from '../store/useStore';

export default function DashboardHome() {
  const { dashboardScrollY, setDashboardScrollY } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = dashboardScrollY;
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setDashboardScrollY(e.currentTarget.scrollTop);
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 flex flex-col overflow-y-auto bg-orange-50/50"
    >
      
      {/* Map Section */}
      <div className="w-full h-[500px] shrink-0 border-b border-gray-300 bg-gray-100 flex p-4 gap-4">
        <div className="flex-1 relative border border-gray-300 bg-white overflow-hidden">
          <MapArea isFullscreen={false} />
        </div>
        <div className="w-[300px] shrink-0 h-full">
          <MapLayersMenu />
        </div>
      </div>

      {/* Modules Section side-by-side */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <SidebarLeft />
        <SidebarRight />
        <div className="col-span-1 md:col-span-2">
          <AnalyticsPanel />
        </div>
      </div>

    </div>
  );
}
