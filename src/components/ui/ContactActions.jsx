import { Mail, Phone, ExternalLink, MessageCircle } from 'lucide-react';
import { normalizePhone, websiteUrl, whatsappUrl } from '../../utils/contacts';

export function EmailLink({ email }) {
  if (!email) return <span className="text-muted">-</span>;
  return (
    <a className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline" href={`mailto:${email}`} onClick={(event) => event.stopPropagation()}>
      <Mail className="h-3.5 w-3.5" />
      {email}
    </a>
  );
}

export function PhoneActions({ phone }) {
  if (!phone) return <span className="text-muted">-</span>;
  const normalized = normalizePhone(phone);
  const waUrl = whatsappUrl(phone);

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="font-semibold text-slate-700">{phone}</span>
      <a className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100" href={`tel:${normalized}`} onClick={(event) => event.stopPropagation()}>
        <Phone className="h-3 w-3" />
        Chiama
      </a>
      {waUrl && (
        <a className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100" href={waUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          <MessageCircle className="h-3 w-3" />
          WhatsApp
        </a>
      )}
    </span>
  );
}

export function WebsiteLink({ website }) {
  if (!website) return <span className="text-muted">-</span>;
  return (
    <a className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline" href={websiteUrl(website)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
      <ExternalLink className="h-3.5 w-3.5" />
      {website}
    </a>
  );
}

