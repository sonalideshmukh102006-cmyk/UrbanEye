import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, BarChart2, MapPin } from 'lucide-react';

const cities = ['Pune', 'Mumbai', 'Delhi', 'Bengaluru'];

const congestionDataByCity: Record<string, any[]> = {
  'Pune': [
    { time: '06:00', density: 20 },
    { time: '09:00', density: 85 },
    { time: '12:00', density: 45 },
    { time: '15:00', density: 50 },
    { time: '18:00', density: 90 },
    { time: '21:00', density: 30 },
  ],
  'Mumbai': [
    { time: '06:00', density: 40 },
    { time: '09:00', density: 95 },
    { time: '12:00', density: 75 },
    { time: '15:00', density: 80 },
    { time: '18:00', density: 98 },
    { time: '21:00', density: 60 },
  ],
  'Delhi': [
    { time: '06:00', density: 30 },
    { time: '09:00', density: 90 },
    { time: '12:00', density: 60 },
    { time: '15:00', density: 70 },
    { time: '18:00', density: 95 },
    { time: '21:00', density: 50 },
  ],
  'Bengaluru': [
    { time: '06:00', density: 35 },
    { time: '09:00', density: 92 },
    { time: '12:00', density: 65 },
    { time: '15:00', density: 75 },
    { time: '18:00', density: 96 },
    { time: '21:00', density: 55 },
  ],
};

const anomalyDataByCity: Record<string, any[]> = {
  'Pune': [
    { name: 'Pothole', count: 42 },
    { name: 'Water Logging', count: 28 },
    { name: 'Missing Sign', count: 12 },
    { name: 'Broken Divider', count: 8 },
  ],
  'Mumbai': [
    { name: 'Pothole', count: 65 },
    { name: 'Water Logging', count: 85 },
    { name: 'Missing Sign', count: 22 },
    { name: 'Broken Divider', count: 15 },
  ],
  'Delhi': [
    { name: 'Pothole', count: 55 },
    { name: 'Water Logging', count: 15 },
    { name: 'Missing Sign', count: 32 },
    { name: 'Broken Divider', count: 25 },
  ],
  'Bengaluru': [
    { name: 'Pothole', count: 75 },
    { name: 'Water Logging', count: 65 },
    { name: 'Missing Sign', count: 18 },
    { name: 'Broken Divider', count: 10 },
  ],
};

export default function AnalyticsPanel() {
  const [selectedCity, setSelectedCity] = useState('Pune');

  const currentCongestion = congestionDataByCity[selectedCity] || congestionDataByCity['Pune'];
  const currentAnomalies = anomalyDataByCity[selectedCity] || anomalyDataByCity['Pune'];

  return (
    <div className="w-full min-h-[400px] max-h-[600px] bg-[#FFF9F2] border border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
      
      {/* City Selector Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">City Analytics</h2>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className="bg-white border border-blue-100 shadow-sm p-5 h-80 flex flex-col rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">{selectedCity} Congestion Trend (24h)</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentCongestion}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
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
            <h3 className="text-sm font-bold text-foreground">{selectedCity} Anomalies Detected by Type</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnomalies} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
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
