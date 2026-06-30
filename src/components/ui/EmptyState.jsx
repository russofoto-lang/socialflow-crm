import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
      <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-700">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
