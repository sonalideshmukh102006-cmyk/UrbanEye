import { Map } from 'lucide-react';

export default function MainMapPlaceholder() {
  return (
    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center flex-col gap-4 text-slate-500">
      <Map className="w-16 h-16 opacity-20" />
      <p className="text-lg font-medium opacity-50">MapLibre GL Interface will render here</p>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-transparent"></div>
    </div>
  );
}
