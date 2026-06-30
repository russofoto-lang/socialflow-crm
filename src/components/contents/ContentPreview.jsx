import { ImageIcon } from 'lucide-react';
import { getFilePublicUrl } from '../../lib/crmApi';

export default function ContentPreview({ content, compact = false }) {
  const file = content.content_files?.find((item) => item.file_type?.startsWith('image/'));
  const size = compact ? 'h-12 w-14' : 'h-24 w-full';

  if (file) {
    return (
      <img
        src={getFilePublicUrl(file.file_path)}
        alt={file.file_name || content.title}
        className={`${size} rounded-md object-cover ring-1 ring-line`}
      />
    );
  }

  return (
    <div className={`${size} grid place-items-center rounded-md bg-slate-100 text-slate-400 ring-1 ring-line`}>
      <ImageIcon className={compact ? 'h-4 w-4' : 'h-6 w-6'} />
    </div>
  );
}
