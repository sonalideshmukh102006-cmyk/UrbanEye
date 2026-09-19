import { useState, useEffect } from 'react';
import { X, CheckCircle2, Shield, MapPin, AlertTriangle, Send, Building2, Truck, Search, Users, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function IncidentModal() {
  const { selectedIncident, setSelectedIncident, returnUrl, setReturnUrl } = useStore();
  const navigate = useNavigate();

  const [localStatus, setLocalStatus] = useState<string>('');
  const [showDispatchMenu, setShowDispatchMenu] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);

  useEffect(() => {
    if (selectedIncident) {
      setLocalStatus(selectedIncident.status || 'Unverified');
      setShowDispatchMenu(false);
    }
  }, [selectedIncident]);

  if (!selectedIncident) return null;

  const handleClose = () => {
    setSelectedIncident(null);
    if (returnUrl) {
      navigate(returnUrl);
      setReturnUrl(null);
    }
  };

  // Use the image provided in the incident data
  const wideImage = selectedIncident.imageUrl;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Incident Evidence File</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Image Evidence (Realistic Road Photo) */}
          <div 
            className="w-full md:w-1/2 relative flex items-center justify-center border-r border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${wideImage})` }}
          >
            <div className="absolute inset-0 bg-black/20"></div> {/* Slight dark overlay for realism */}
            
            {/* Cropped Defect Box */}
            <div className="z-10 border-2 border-red-500 w-40 h-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover bg-center shadow-2xl"
                 style={{ backgroundImage: selectedIncident.croppedImageUrl ? `url(${selectedIncident.croppedImageUrl})` : 'none' }}>
              <span className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-bold px-2 py-1 whitespace-nowrap shadow-sm">
                AI DETECTED: {selectedIncident.type || 'ANOMALY'}
              </span>
            </div>
            
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
              CAM_ID: {selectedIncident.source || 'BUS-CAM-FRONT'} <br/>
              CONFIDENCE: 98.4%
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{selectedIncident.type || 'Anomaly Detected'}</h3>
              <p className="text-sm text-muted-foreground mb-2">Ticket ID: {selectedIncident.id} {selectedIncident.time && `• ${selectedIncident.time}`}</p>
              {selectedIncident.description && (
                <p className="text-sm text-foreground">{selectedIncident.description}</p>
              )}
            </div>

            {selectedIncident.cameraQualityIssue && (
              <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">Poor Camera Quality Detected</p>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80">{selectedIncident.cameraQualityReason || 'Unrecognized data due to low image quality.'}</p>
                </div>
              </div>
            )}

            {selectedIncident.type === 'VulnerablePedestrian' && (
              <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30 flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Pedestrian Safety Alert</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Vulnerable pedestrians detected. Immediate caution required in this zone.</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="bg-muted/50 rounded-lg p-3 flex-1 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Severity</p>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <AlertTriangle className={`w-4 h-4 ${selectedIncident.severity === 'Critical' ? 'text-destructive' : 'text-orange-500'}`} />
                  {selectedIncident.severity}
                </p>
              </div>
              <div className={`rounded-lg p-3 flex-1 border border-border transition-colors duration-300 ${['Verified', 'Resolved'].includes(localStatus) ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  {localStatus === 'Resolved' && selectedIncident.resolutionScore && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      Score: {selectedIncident.resolutionScore}/100
                    </span>
                  )}
                </div>
                <p className={`font-bold flex items-center gap-1 ${['Verified', 'Resolved'].includes(localStatus) ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                  {['Verified', 'Resolved'].includes(localStatus) && <CheckCircle2 className="w-4 h-4" />}
                  {localStatus}
                </p>
              </div>
            </div>

             <div className="bg-muted/50 rounded-lg p-4 border border-border">
               <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Location Details</p>
               
               <div className="flex flex-col gap-1">
                 <p className="font-bold text-base text-foreground flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-primary shrink-0" />
                   {selectedIncident.locationName || selectedIncident.location || 'Unknown Road Segment'}
                 </p>
                 <p className="font-mono text-xs text-muted-foreground ml-7">
                   GPS: {selectedIncident.latitude ? `${selectedIncident.latitude.toFixed(4)}, ${selectedIncident.longitude.toFixed(4)}` : 'Not Available'}
                 </p>
               </div>
            </div>

            {selectedIncident.vehicleNo && selectedIncident.anprImageUrl && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">ANPR / Number Plate Details</p>
                <div className="flex gap-4 items-center">
                  <img 
                    src={selectedIncident.anprImageUrl} 
                    alt="Number Plate" 
                    className="w-24 h-12 object-cover rounded border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setExpandedImage(selectedIncident.anprImageUrl)}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Detected Vehicle</p>
                    <p className="text-lg font-bold text-foreground font-mono">{selectedIncident.vehicleNo}</p>
                    {selectedIncident.confidenceScore && (
                      <button 
                        onClick={() => setShowConfidenceDetails(true)}
                        className="mt-1 flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded cursor-pointer hover:bg-green-200 transition-colors"
                      >
                         Confidence: {selectedIncident.confidenceScore}% <Info className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedIncident.signLanguage && (
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                 <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 font-bold">Multilingual Signboard Details</p>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-muted-foreground">Original Language ({selectedIncident.signLanguage})</p>
                     <p className="font-bold text-foreground text-lg">{selectedIncident.originalText}</p>
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground">English Translation</p>
                     <p className="font-bold text-foreground text-lg">{selectedIncident.englishTranslation}</p>
                   </div>
                 </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex gap-2 relative">
              <button 
                onClick={() => {
                  const store = useStore.getState();
                  store.setInvestigationIncident(selectedIncident);
                  setSelectedIncident(null);
                }}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" /> Investigate Timeline
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Image Overlay */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
              onClick={() => setExpandedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={expandedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-white/20" 
            />
          </div>
        </div>
      )}

      {/* Confidence Details Modal */}
      {showConfidenceDetails && selectedIncident.confidenceScore && (
        <div 
          className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowConfidenceDetails(false)}
        >
          <div 
            className="bg-card rounded-xl max-w-md w-full p-6 shadow-2xl border border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> 
                ANPR Confidence Analysis
              </h3>
              <button onClick={() => setShowConfidenceDetails(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <span className="font-bold text-foreground">Overall Score</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{selectedIncident.confidenceScore}%</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Calculation Basis for this Report:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span> 
                    <span><strong>Character Clarity:</strong> Optical Character Recognition (OCR) matched letters clearly without motion blur.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span> 
                    <span><strong>Lighting & Contrast:</strong> Sufficient illumination on the retroreflective plate surface.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span> 
                    <span><strong>Angle & Perspective:</strong> Vehicle captured at an optimal angle (&lt; 30 degrees).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={selectedIncident.confidenceScore > 90 ? "text-green-500" : "text-orange-500"}>
                      {selectedIncident.confidenceScore > 90 ? "✓" : "!"}
                    </span> 
                    <span><strong>Plate Condition:</strong> {selectedIncident.confidenceScore > 90 ? "Clean plate surface with no major obstructions." : "Minor obstructions or dirt detected, slightly lowering the score."}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
