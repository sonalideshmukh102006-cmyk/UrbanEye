import MapArea from '../components/MapArea';

export default function FullscreenMap() {
  return (
    <div className="flex-1 relative w-full h-full bg-slate-900">
      <MapArea isFullscreen={true} />
    </div>
  );
}
