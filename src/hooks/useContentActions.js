import { useState } from 'react';
import { deleteContent as deleteContentRecord, duplicateContent as duplicateContentRecord, updateContentStatus, uploadContentFile, upsertContent } from '../lib/crmApi';

export default function useContentActions({
  userId,
  refresh,
  confirmDelete = true,
  messages = {},
  onAfterSave,
  onAfterDelete,
  onAfterDuplicate,
  onAfterStatusChange
} = {}) {
  const [selectedContent, setSelectedContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const runRefresh = async () => {
    if (refresh) await refresh();
  };

  const openContentDetail = (content) => setSelectedContent(content);
  const closeContentDetail = () => setSelectedContent(null);
  const clearContentFeedback = () => {
    setError('');
    setSuccess('');
  };

  const saveContent = async (payload) => {
    setSaving(true);
    clearContentFeedback();
    try {
      const isEdit = Boolean(payload.id);
      const { pendingFile, ...contentPayload } = payload;
      const saved = await upsertContent({ ...contentPayload, created_by: contentPayload.created_by ?? userId });
      if (pendingFile) await uploadContentFile({ contentId: saved.id, file: pendingFile, userId });
      setSelectedContent((current) => current?.id === saved.id ? { ...current, ...saved } : current);
      setSuccess(isEdit ? messages.saveEdit ?? 'Contenuto aggiornato.' : messages.saveCreate ?? 'Contenuto creato.');
      await onAfterSave?.(saved, payload);
      await runRefresh();
      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (content) => {
    if (!content) return undefined;
    const confirmed = !confirmDelete || window.confirm(`Eliminare il contenuto "${content.title}"? Questa azione non puo essere annullata.`);
    if (!confirmed) return undefined;
    clearContentFeedback();
    try {
      await deleteContentRecord(content.id);
      setSelectedContent(null);
      setSuccess(messages.delete ?? 'Contenuto eliminato.');
      await onAfterDelete?.(content);
      await runRefresh();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const duplicateContent = async (content) => {
    if (!content) return undefined;
    clearContentFeedback();
    try {
      const duplicated = await duplicateContentRecord(content, userId);
      setSuccess(messages.duplicate ?? 'Contenuto duplicato in Idee.');
      await onAfterDuplicate?.(duplicated, content);
      await runRefresh();
      return duplicated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const changeContentStatus = async (id, status) => {
    clearContentFeedback();
    try {
      const updated = await updateContentStatus(id, status);
      setSelectedContent((current) => current?.id === id ? { ...current, ...updated, status } : current);
      setSuccess(messages.status ?? 'Stato contenuto aggiornato.');
      await onAfterStatusChange?.(updated, status);
      await runRefresh();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    selectedContent,
    setSelectedContent,
    saving,
    error,
    success,
    setError,
    setSuccess,
    clearContentFeedback,
    openContentDetail,
    closeContentDetail,
    saveContent,
    deleteContent,
    duplicateContent,
    changeContentStatus
  };
}
