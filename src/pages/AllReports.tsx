import { ArrowLeft, Search, Filter, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_VIOLATIONS } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function AllReports() {
  const navigate = useNavigate();
  const { setSelectedIncident } = useStore();

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
            <h1 className="text-xl font-black text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> ALL DRIVING REPORTS
            </h1>
            <p className="text-sm text-muted-foreground">Comprehensive log of all AI-detected violations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 w-64 shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search Vehicle No or ID..." 
              className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border hover:bg-muted rounded-lg text-sm font-bold text-foreground transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-bold">Ticket ID</th>
                <th className="p-4 font-bold">Time & Date</th>
                <th className="p-4 font-bold">Violation Type</th>
                <th className="p-4 font-bold">Vehicle Details</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold">Source Cam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_VIOLATIONS.map((violation) => (
                <tr 
                  key={violation.id} 
                  onClick={() => setSelectedIncident(violation)} 
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-foreground">{violation.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{violation.time}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      violation.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 
                      violation.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {violation.severity === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                      {violation.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-primary">{violation.vehicleNo}</span>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {violation.location}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {violation.bus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
