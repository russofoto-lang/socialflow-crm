import { Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { approveContent, requestChanges } from '../../lib/crmApi';
import ErrorState from '../ui/ErrorState.jsx';

export default function ApprovalActions({ content, userId, onDone }) {
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');

  const approve = async () => {
    setSaving('approve');
    setError('');
    try {
      await approveContent({ id: content.id, userId });
      onDone?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving('');
    }
  };

  const changes = async () => {
    if (!comment.trim()) {
      setError('Per richiedere modifiche serve un commento.');
      return;
    }
    setSaving('changes');
    setError('');
    try {
      await requestChanges({ id: content.id, userId, commentText: comment.trim() });
      setComment('');
      onDone?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="grid gap-3">
      <textarea className="form-input min-h-24" placeholder="Commento per eventuali modifiche..." value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={approve} disabled={Boolean(saving)}>
          <Check className="h-4 w-4" />
          {saving === 'approve' ? 'Approvo...' : 'Approva'}
        </button>
        <button className="btn-secondary" onClick={changes} disabled={Boolean(saving)}>
          <RotateCcw className="h-4 w-4" />
          {saving === 'changes' ? 'Invio...' : 'Richiedi modifiche'}
        </button>
      </div>
      <ErrorState message={error} />
    </div>
  );
}
