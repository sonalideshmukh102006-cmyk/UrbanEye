import { ArrowLeft, Search, Filter, MapPin, AlertTriangle, Waves, Camera, Baseline, Navigation, Columns, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { MOCK_INCIDENTS } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function DefectList() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { flyTo, setSelectedIncident, setReturnUrl } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredDefects = MOCK_INCIDENTS.filter(i => {
    if (i.type !== type) return false;
    const matchesSearch = 
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || i.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportToCSV = () => {
    const headers = ['Incident ID', 'Type', 'Severity', 'Location', 'Latitude', 'Longitude', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredDefects.map(d => 
        `"${d.id}","${d.type}","${d.severity}","${d.locationName}","${d.latitude}","${d.longitude}","${d.description.replace(/"/g, '""')}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_defects.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = () => {
    if (type === 'Pothole') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    if (type === 'WaterLogging') return <Waves className="w-5 h-5 text-blue-500" />;
    if (type === 'MissingZebraCrossing') return <Baseline className="w-5 h-5 text-primary" />;
    if (type === 'MissingSign') return <Navigation className="w-5 h-5 text-primary" />;
    if (type === 'BrokenDivider') return <Columns className="w-5 h-5 text-primary" />;
    return <MapPin className="w-5 h-5 text-primary" />;
  };

  const getTitle = () => {
    if (type === 'Pothole') return 'POTHOLE REPORTS';
    if (type === 'WaterLogging') return 'WATER LOGGING REPORTS';
    if (type === 'MissingZebraCrossing') return 'MISSING ZEBRA CROSSING REPORTS';
    if (type === 'MissingSign') return 'MISSING SIGN BOARD REPORTS';
    if (type === 'BrokenDivider') return 'BROKEN DIVIDER REPORTS';
    return `${type} REPORTS`;
  };

  const handleIncidentClick = (incident: any) => {
    setReturnUrl(`/defects/${type}`);
    navigate('/');
    setTimeout(() => {
      flyTo(incident.longitude, incident.latitude, 16);
      setSelectedIncident(incident);
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 mt-14">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-background border border-border hover:bg-muted rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground flex items-center gap-2 uppercase tracking-tight">
              {getIcon()} {getTitle()}
            </h1>
            <p className="text-sm text-muted-foreground">{filteredDefects.length} incidents requiring attention</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 w-64 shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search location, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-muted-foreground mr-2" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground font-medium cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold text-primary-foreground transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDefects.map((defect) => (
            <div
              key={defect.id}
              onClick={() => handleIncidentClick(defect)}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
            >
              <div
                className="h-48 w-full bg-muted relative bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${defect.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg truncate">{defect.locationName}</h3>
                  <p className="text-xs text-white/80 font-mono">{defect.latitude.toFixed(4)}, {defect.longitude.toFixed(4)}</p>
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${defect.severity === 'Critical' ? 'bg-red-500 text-white' :
                    defect.severity === 'High' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'
                  }`}>
                  {defect.severity}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{defect.description}</p>
                <div className="flex justify-between items-center border-t border-border pt-3 mt-auto">
                  <span className="text-xs font-mono text-muted-foreground">{defect.id}</span>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 group-hover:underline">
                    View Evidence <Camera className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
