import { Link } from 'react-router-dom';

export default function StatCard({ label, value, tone = 'brand', to, icon: Icon }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    mint: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    coral: 'bg-rose-50 text-rose-700 ring-rose-100'
  };

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-slate-400" />}
      </div>
      <p className={`mt-4 inline-flex min-w-14 justify-center rounded-md px-3 py-1 text-3xl font-black ring-1 ${tones[tone]}`}>
        {value}
      </p>
      {to && <p className="mt-4 text-xs font-semibold text-brand-700">Apri sezione</p>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="surface block p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
        {content}
      </Link>
    );
  }

  return <div className="surface p-5">{content}</div>;
}
