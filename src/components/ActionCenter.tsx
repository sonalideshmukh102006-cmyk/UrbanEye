import { useState } from 'react';
import { Filter, CheckCircle2, AlertTriangle, Shield, Clock, Send, Building2, Truck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function ActionCenter() {
  const navigate = useNavigate();
  const { setSelectedIncident } = useStore();
  const [tickets, setTickets] = useState(MOCK_INCIDENTS);
  const [activeDispatchMenu, setActiveDispatchMenu] = useState<string | null>(null);

  const handleVerify = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Verified' } : t));
  };

  const toggleDispatchMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDispatchMenu(prev => prev === id ? null : id);
  };

  const handleDispatch = (e: React.MouseEvent, id: string, department: string) => {
    e.stopPropagation();
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Assigned', assignee: department } : t));
    setActiveDispatchMenu(null);
  };

  return (
    <div className="w-full min-h-[400px] max-h-[600px] bg-[#FFF9F2] border border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors mr-1"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Shield className="w-5 h-5 text-primary" /> Action Center & AI Triage
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Smart queue for verifying and assigning AI-detected anomalies.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            Auto-Assign Routine
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4 font-semibold">Ticket ID</th>
              <th className="p-4 font-semibold">Anomaly Details</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Assignment</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                onClick={() => setSelectedIncident(ticket)}
                className="hover:bg-muted/30 transition-colors group cursor-pointer"
              >
                
                {/* ID & Time */}
                <td className="p-4 align-top">
                  <div className="font-mono text-sm font-bold text-foreground">{ticket.id}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {ticket.time || 'Just now'}
                  </div>
                </td>

                {/* Details */}
                <td className="p-4 align-top">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                      ticket.severity === 'Critical' ? 'bg-destructive/10 text-destructive' :
                      ticket.severity === 'High' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {ticket.severity === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                      {ticket.severity}
                    </span>
                    <span className="text-sm font-bold text-foreground">{ticket.type}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Source: {ticket.source || 'Community'}</div>
                </td>

                {/* Status Badge */}
                <td className="p-4 align-top">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    ticket.status === 'Unverified' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400' :
                    ticket.status === 'Verified' ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' :
                    ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' :
                    ticket.status === 'Alerted' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400' :
                    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                  }`}>
                    {(ticket.status === 'Resolved' || ticket.status === 'Verified') && <CheckCircle2 className="w-3 h-3" />}
                    {ticket.status === 'Unverified' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                    {ticket.status || 'Unverified'}
                  </span>
                </td>

                {/* Assignment */}
                <td className="p-4 align-top">
                  {ticket.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {ticket.assignee.charAt(0)}
                      </div>
                      <span className="text-sm text-foreground">{ticket.assignee}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Unassigned</span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 align-top text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(ticket.status === 'Unverified' || !ticket.status) && (
                      <button 
                        onClick={(e) => handleVerify(e, ticket.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-md transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Verify
                      </button>
                    )}
                    {ticket.status !== 'Resolved' && (
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleDispatchMenu(e, ticket.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Dispatch
                        </button>
                        
                        {activeDispatchMenu === ticket.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1 flex flex-col text-left">
                              <button onClick={(e) => handleDispatch(e, ticket.id, 'Traffic Police')} className="text-left px-3 py-2 text-xs text-foreground font-semibold hover:bg-muted rounded-md transition-colors flex items-center gap-2">
                                <Shield className="w-3 h-3 text-blue-500" /> Traffic Police
                              </button>
                              <button onClick={(e) => handleDispatch(e, ticket.id, 'Towing Service')} className="text-left px-3 py-2 text-xs text-foreground font-semibold hover:bg-muted rounded-md transition-colors flex items-center gap-2">
                                <Truck className="w-3 h-3 text-orange-500" /> Towing Service
                              </button>
                              <button onClick={(e) => handleDispatch(e, ticket.id, 'PWD (Roads)')} className="text-left px-3 py-2 text-xs text-foreground font-semibold hover:bg-muted rounded-md transition-colors flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-emerald-500" /> PWD (Roads)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
