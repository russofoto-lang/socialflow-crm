import EmptyState from '../ui/EmptyState.jsx';
import BoardCard from './BoardCard.jsx';

export default function BoardColumn({ title, contents, onStatusChange }) {
  return (
    <section className="min-w-[18rem] flex-1 rounded-lg border border-line bg-slate-100/80 p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-black">{title}</h2>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-black text-muted ring-1 ring-line">{contents.length}</span>
      </div>
      <div className="grid gap-3">
        {contents.map((content) => <BoardCard key={content.id} content={content} onStatusChange={onStatusChange} />)}
        {contents.length === 0 && <EmptyState title="Colonna vuota" description="Nessun contenuto in questo stato." />}
      </div>
    </section>
  );
}
