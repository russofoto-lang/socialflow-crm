import { Inbox } from 'lucide-react';
import { useState } from 'react';
import BoardCard from './BoardCard.jsx';

export default function BoardColumn({ title, status, contents, onOpen, onStatusChange }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const contentId = event.dataTransfer.getData('text/plain');
    if (contentId) onStatusChange?.(contentId, status);
  };

  return (
    <section
      className={`min-w-[18.5rem] flex-1 rounded-xl border p-3 shadow-sm transition ${isDragOver ? 'border-brand-400 bg-brand-50' : 'border-line bg-slate-100/80'}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-black">{title}</h2>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-black text-muted ring-1 ring-line">{contents.length}</span>
      </div>
      <div className="grid gap-3">
        {contents.map((content) => <BoardCard key={content.id} content={content} onOpen={onOpen} onStatusChange={onStatusChange} />)}
        {contents.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center">
            <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-400">
              <Inbox className="h-4 w-4" />
            </div>
            <p className="text-xs font-bold text-slate-500">Nessun contenuto</p>
            <p className="mt-1 text-xs text-slate-400">Le card appariranno qui quando cambiano stato.</p>
          </div>
        )}
      </div>
    </section>
  );
}
