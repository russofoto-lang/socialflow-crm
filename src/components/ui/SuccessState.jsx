import { CheckCircle2 } from 'lucide-react';

export default function SuccessState({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
      <CheckCircle2 className="h-4 w-4" />
      {message}
    </div>
  );
}
