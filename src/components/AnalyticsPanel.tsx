import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Legend 
} from 'recharts';
import { Activity, BarChart2, Clock, ShieldAlert } from 'lucide-react';
import { MOCK_INCIDENTS, MOCK_TRAFFIC_CORRIDORS } from '../data/mockData';

export default function AnalyticsPanel() {
  const [selectedLocation, setSelectedLocation] = useState('Overall Pune');

  const locations = ['Overall Pune', ...MOCK_TRAFFIC_CORRIDORS.map(c => c.name)];

  const { currentCongestion, currentAnomalies, slaData, wardHealthData } = useMemo(() => {
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

    // B. Defect Resolution SLA Data
    const statusCount = { Verified: 0, Assigned: 0, Resolved: 0, Unverified: 0 };
    MOCK_INCIDENTS.forEach(inc => {
      const statusStr = inc.status?.toLowerCase() || '';
      if (statusStr.includes('resolved')) statusCount.Resolved++;
      else if (statusStr.includes('assigned')) statusCount.Assigned++;
      else if (statusStr.includes('unverified')) statusCount.Unverified++;
      else statusCount.Verified++;
    });

    const slaData = [
      { name: 'Resolved', value: statusCount.Resolved, color: '#10b981' }, // emerald-500
      { name: 'Verified', value: statusCount.Verified, color: '#3b82f6' }, // blue-500
      { name: 'Assigned', value: statusCount.Assigned, color: '#f59e0b' }, // amber-500
      { name: 'Unverified', value: statusCount.Unverified, color: '#ef4444' } // red-500
    ].filter(item => item.value > 0);

    // E. Ward-wise Infrastructure Health (Radar Chart)
    const wardHealthData = [
      { subject: 'Road Quality', 'FC Road': 85, 'Swargate': 40, 'Viman Nagar': 70, fullMark: 100 },
      { subject: 'Safety Signs', 'FC Road': 90, 'Swargate': 60, 'Viman Nagar': 85, fullMark: 100 },
      { subject: 'Traffic Flow', 'FC Road': 40, 'Swargate': 20, 'Viman Nagar': 65, fullMark: 100 },
      { subject: 'Pedestrian Safety', 'FC Road': 75, 'Swargate': 50, 'Viman Nagar': 80, fullMark: 100 },
    ];

    return { currentCongestion, currentAnomalies: anomaliesArray, slaData, wardHealthData };
  }, [selectedLocation]);

  return (
    <div className="w-full min-h-[400px] max-h-[800px] bg-[#FFF9F2] border border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
      
      {/* Location Selector Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
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
        
        {/* Line Chart: Congestion */}
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

        {/* Bar Chart: Anomalies */}
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

        {/* Pie Chart: Defect Resolution SLA */}
        <div className="bg-white border border-blue-100 shadow-sm p-5 h-80 flex flex-col rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-foreground">Defect Resolution SLA (Status)</h3>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {slaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{slaData.reduce((acc, curr) => acc + curr.value, 0)}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart: Ward-wise Health */}
        <div className="bg-white border border-blue-100 shadow-sm p-5 h-80 flex flex-col rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-foreground">Ward-wise Infrastructure Health</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={wardHealthData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="FC Road" dataKey="FC Road" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Swargate" dataKey="Swargate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Viman Nagar" dataKey="Viman Nagar" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
