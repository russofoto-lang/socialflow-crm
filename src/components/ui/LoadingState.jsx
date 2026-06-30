export default function LoadingState({ label = 'Caricamento...', fullScreen = false }) {
  return (
    <div className={`grid place-items-center ${fullScreen ? 'min-h-screen' : 'min-h-48'}`}>
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-5 py-4 text-sm font-medium text-muted shadow-soft">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
