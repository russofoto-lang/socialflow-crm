import { Send } from 'lucide-react';
import { useState } from 'react';
import { addComment } from '../../lib/crmApi';
import ErrorState from '../ui/ErrorState.jsx';

export default function CommentBox({ contentId, userId, type = 'client', comments = [], onAdded }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    setError('');
    try {
      const comment = await addComment({ content_id: contentId, user_id: userId, comment_text: text.trim(), comment_type: type });
      setText('');
      onAdded?.(comment);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        {comments.length === 0 && <p className="text-sm text-muted">Nessun commento.</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
            <p className="font-semibold">{comment.profiles?.full_name ?? 'Utente'}</p>
            <p className="mt-1 text-slate-700">{comment.comment_text}</p>
          </div>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={submit}>
        <input className="form-input" placeholder="Scrivi un commento..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary px-3" disabled={saving} aria-label="Invia commento"><Send className="h-4 w-4" /></button>
      </form>
      <ErrorState message={error} />
    </div>
  );
}
