import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, BarChart2, MapPin } from 'lucide-react';
import { MOCK_INCIDENTS, MOCK_TRAFFIC_CORRIDORS } from '../data/mockData';

export default function AnalyticsPanel() {
  const [selectedLocation, setSelectedLocation] = useState('Overall Pune');

  const locations = ['Overall Pune', ...MOCK_TRAFFIC_CORRIDORS.map(c => c.name)];

  const { currentCongestion, currentAnomalies } = useMemo(() => {
    let anomaliesCount: Record<string, number> = {};
    let baseDensity = 60; // default average

    if (selectedLocation === 'Overall Pune') {
      MOCK_INCIDENTS.forEach(inc => {
        anomaliesCount[inc.type] = (anomaliesCount[inc.type] || 0) + 1;
      });
      baseDensity = MOCK_TRAFFIC_CORRIDORS.reduce((acc, c) => acc + c.density, 0) / MOCK_TRAFFIC_CORRIDORS.length;
    } else {
      // Find the specific corridor
      const corridor = MOCK_TRAFFIC_CORRIDORS.find(c => c.name === selectedLocation);
      if (corridor) {
        baseDensity = corridor.density;
      }
      
      // Filter incidents for this location. Simple string matching against base name
      const locKey = selectedLocation
        .replace(' Corridor', '')
        .replace(' Junction', '')
        .replace(' Road', '')
        .replace(' Highway', '')
        .replace(' Stand', '');
        
      MOCK_INCIDENTS.forEach(inc => {
        if (inc.locationName && inc.locationName.includes(locKey)) {
          anomaliesCount[inc.type] = (anomaliesCount[inc.type] || 0) + 1;
        }
      });
    }

    // Generate anomalies array, sorted by count descending
    let anomaliesArray = Object.entries(anomaliesCount).map(([name, count]) => ({
      // Clean up names like 'MissingZebraCrossing' -> 'Missing Zebra Crossing'
      name: name.replace(/([A-Z])/g, ' $1').trim(),
      count
    })).sort((a, b) => b.count - a.count);

    if (anomaliesArray.length === 0) {
       anomaliesArray = [{ name: 'No anomalies', count: 0 }];
    }

    // Generate synthetic 24h congestion trend based on real baseDensity data
    const currentCongestion = [
      { time: '06:00', density: Math.max(10, Math.floor(baseDensity * 0.3)) },
      { time: '09:00', density: Math.floor(baseDensity) },
      { time: '12:00', density: Math.floor(baseDensity * 0.6) },
      { time: '15:00', density: Math.floor(baseDensity * 0.7) },
      { time: '18:00', density: Math.min(100, Math.floor(baseDensity * 1.1)) },
      { time: '21:00', density: Math.max(15, Math.floor(baseDensity * 0.4)) },
    ];

    return { currentCongestion, currentAnomalies: anomaliesArray };
  }, [selectedLocation]);

  return (
    <div className="w-full min-h-[400px] max-h-[600px] bg-[#FFF9F2] border border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
      
      {/* Location Selector Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">City Analytics</h2>
        <select 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className="bg-white border border-blue-100 shadow-sm p-5 h-80 flex flex-col rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">{selectedLocation} Congestion Trend (24h)</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentCongestion}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Line type="monotone" dataKey="density" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-blue-100 shadow-sm p-5 h-80 flex flex-col rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">{selectedLocation} Anomalies Detected</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnomalies} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={130} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(100, 100, 100, 0.1)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
