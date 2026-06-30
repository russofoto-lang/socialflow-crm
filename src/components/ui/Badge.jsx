import { approvalOptions, contentTypeOptions, labelFor, platformOptions, statusOptions } from '../../lib/options';

const badgeClasses = {
  ideas: 'bg-violet-50 text-violet-700 ring-violet-100',
  todo: 'bg-slate-100 text-slate-700 ring-slate-200',
  in_progress: 'bg-sky-50 text-sky-700 ring-sky-100',
  to_approve: 'bg-amber-50 text-amber-700 ring-amber-100',
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  changes_requested: 'bg-rose-50 text-rose-700 ring-rose-100',
  not_required: 'bg-slate-100 text-slate-600 ring-slate-200',
  instagram: 'bg-pink-50 text-pink-700 ring-pink-100',
  facebook: 'bg-blue-50 text-blue-700 ring-blue-100',
  instagram_facebook: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  post: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  reel: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100',
  stories: 'bg-orange-50 text-orange-700 ring-orange-100',
  carousel: 'bg-teal-50 text-teal-700 ring-teal-100'
};

export default function Badge({ type = 'status', value }) {
  const options = type === 'contentType' ? contentTypeOptions : type === 'platform' ? platformOptions : type === 'approval' ? approvalOptions : statusOptions;
  const fallback = value === 'active' ? 'Attivo' : value === 'inactive' ? 'Non attivo' : value;
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${badgeClasses[value] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {labelFor(options, value) || fallback}
    </span>
  );
}
