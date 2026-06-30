import { useEffect, useState } from 'react';
import ApprovalActions from '../../components/contents/ApprovalActions.jsx';
import CommentBox from '../../components/comments/CommentBox.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getFilePublicUrl, listContents } from '../../lib/crmApi';

export default function ClientApprovalPage() {
  const { profile, user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = () => listContents({ client_id: profile.client_id }).then(setContents).catch((err) => setError(err.message)).finally(() => setLoading(false));

  useEffect(() => { refresh(); }, [profile.client_id]);
  if (loading) return <LoadingState />;

  const toApprove = contents.filter((content) => content.status === 'to_approve' || content.approval_status === 'pending');

  return (
    <div>
      <PageTitle title="Da approvare" description="Contenuti inviati dall'agenzia per la tua revisione." />
      <ErrorState message={error} />
      <div className="grid gap-4">
        {toApprove.map((content) => (
          <article key={content.id} className="rounded-md border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><h2 className="text-lg font-bold">{content.title}</h2><p className="mt-2 whitespace-pre-line text-sm text-slate-700">{content.copy_text}</p></div>
              <div className="flex flex-wrap gap-2"><Badge type="contentType" value={content.content_type} /><Badge type="platform" value={content.platform} /><Badge type="approval" value={content.approval_status} /></div>
            </div>
            {content.content_files?.length > 0 && (
              <div className="mt-4 grid gap-2">
                {content.content_files.map((file) => <a key={file.id} className="text-sm font-semibold text-brand-700 hover:underline" href={getFilePublicUrl(file.file_path)} target="_blank" rel="noreferrer">{file.file_name}</a>)}
              </div>
            )}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <CommentBox contentId={content.id} userId={user.id} comments={content.comments ?? []} onAdded={refresh} />
              <ApprovalActions content={content} userId={user.id} onDone={refresh} />
            </div>
          </article>
        ))}
        {toApprove.length === 0 && <EmptyState title="Nessun contenuto in attesa" description="Quando l'agenzia invierà nuove bozze, le troverai qui." />}
      </div>
    </div>
  );
}
