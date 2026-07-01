import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { normalizeContacts, normalizeSocialLinks } from '../../utils/contacts';

const emptyClient = {
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  contacts: [{ name: '', role: '', email: '', phone: '' }],
  business_description: '',
  social_links: [{ brand: '', platform: '', url: '' }],
  managed_brands: '',
  notes: '',
  status: 'active'
};

export default function ClientForm({ initialValue, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyClient);

  useEffect(() => {
    const contacts = normalizeContacts(initialValue ?? emptyClient);
    const socialLinks = normalizeSocialLinks(initialValue ?? emptyClient);
    setForm({
      ...emptyClient,
      ...(initialValue ?? {}),
      contacts: contacts.length ? contacts : emptyClient.contacts,
      social_links: socialLinks.length ? socialLinks : emptyClient.social_links
    });
  }, [initialValue]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateContact = (index, field, value) => setForm((current) => ({
    ...current,
    contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? { ...contact, [field]: value } : contact)
  }));
  const addContact = () => setForm((current) => ({ ...current, contacts: [...current.contacts, { name: '', role: '', email: '', phone: '' }] }));
  const removeContact = (index) => setForm((current) => ({ ...current, contacts: current.contacts.filter((_, contactIndex) => contactIndex !== index) }));
  const updateSocial = (index, field, value) => setForm((current) => ({
    ...current,
    social_links: current.social_links.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)
  }));
  const addSocial = () => setForm((current) => ({ ...current, social_links: [...current.social_links, { brand: '', platform: '', url: '' }] }));
  const removeSocial = (index) => setForm((current) => ({ ...current, social_links: current.social_links.filter((_, itemIndex) => itemIndex !== index) }));

  return (
    <form
      className="surface grid gap-6 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const contacts = form.contacts
          .map((contact) => ({
            name: contact.name?.trim() ?? '',
            role: contact.role?.trim() ?? '',
            email: contact.email?.trim() ?? '',
            phone: contact.phone?.trim() ?? ''
          }))
          .filter((contact) => contact.name || contact.role || contact.email || contact.phone);
        const primary = contacts[0] ?? { name: '', email: '', phone: '' };
        const socialLinks = form.social_links
          .map((item) => ({
            brand: item.brand?.trim() ?? '',
            platform: item.platform?.trim() ?? '',
            url: item.url?.trim() ?? ''
          }))
          .filter((item) => item.brand || item.platform || item.url);
        onSubmit({
          ...form,
          name: form.name.trim(),
          website: form.website?.trim() ?? '',
          business_description: form.business_description?.trim() ?? '',
          contacts,
          social_links: socialLinks,
          managed_brands: socialLinks.map((item) => item.brand).filter(Boolean).join(', ') || form.managed_brands,
          contact_name: primary.name,
          email: primary.email,
          phone: primary.phone
        });
      }}
    >
      <div>
        <h2 className="section-title">{initialValue?.id ? 'Modifica cliente' : 'Nuovo cliente'}</h2>
        <p className="mt-1 text-sm text-muted">Mantieni ordinati dati, operativita e note interne.</p>
      </div>
      <section className="grid gap-4 border-t border-line pt-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-brand-700">Dati cliente</p>
        </div>
        <label className="text-sm font-semibold">Nome cliente<input className="form-input mt-1" required value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
        <label className="text-sm font-semibold">Sito internet<input className="form-input mt-1" placeholder="www.cliente.it" value={form.website ?? ''} onChange={(e) => update('website', e.target.value)} /></label>
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black">Referenti</p>
            <button type="button" className="btn-secondary" onClick={addContact}><Plus className="h-4 w-4" />Aggiungi referente</button>
          </div>
          <div className="grid gap-3">
            {form.contacts.map((contact, index) => (
              <div key={index} className="rounded-lg border border-line bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Referente {index + 1}</p>
                  {form.contacts.length > 1 && (
                    <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline" onClick={() => removeContact(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Rimuovi
                    </button>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm font-semibold">Nome<input className="form-input mt-1" value={contact.name ?? ''} onChange={(e) => updateContact(index, 'name', e.target.value)} /></label>
                  <label className="text-sm font-semibold">Ruolo<input className="form-input mt-1" placeholder="es. Titolare, Marketing" value={contact.role ?? ''} onChange={(e) => updateContact(index, 'role', e.target.value)} /></label>
                  <label className="text-sm font-semibold">Email<input className="form-input mt-1" type="email" value={contact.email ?? ''} onChange={(e) => updateContact(index, 'email', e.target.value)} /></label>
                  <label className="text-sm font-semibold">Telefono<input className="form-input mt-1" value={contact.phone ?? ''} onChange={(e) => updateContact(index, 'phone', e.target.value)} /></label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 border-t border-line pt-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-brand-700">Informazioni operative</p>
        </div>
        <label className="text-sm font-semibold md:col-span-2">Di cosa si occupa il cliente<textarea className="form-input mt-1 min-h-24" placeholder="Descrivi attivita, servizi, pubblico, tono o particolarita operative." value={form.business_description ?? ''} onChange={(e) => update('business_description', e.target.value)} /></label>
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black">Brand/social gestiti</p>
            <button type="button" className="btn-secondary" onClick={addSocial}><Plus className="h-4 w-4" />Aggiungi social</button>
          </div>
          <div className="grid gap-3">
            {form.social_links.map((item, index) => (
              <div key={index} className="rounded-lg border border-line bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Social {index + 1}</p>
                  {form.social_links.length > 1 && (
                    <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline" onClick={() => removeSocial(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Rimuovi
                    </button>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="text-sm font-semibold">Brand<input className="form-input mt-1" placeholder="es. Ristorante Aurora" value={item.brand ?? ''} onChange={(e) => updateSocial(index, 'brand', e.target.value)} /></label>
                  <label className="text-sm font-semibold">Piattaforma<input className="form-input mt-1" placeholder="Instagram, Facebook, TikTok..." value={item.platform ?? ''} onChange={(e) => updateSocial(index, 'platform', e.target.value)} /></label>
                  <label className="text-sm font-semibold">Link<input className="form-input mt-1" placeholder="https://..." value={item.url ?? ''} onChange={(e) => updateSocial(index, 'url', e.target.value)} /></label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <label className="text-sm font-semibold">Stato<select className="form-input mt-1" value={form.status} onChange={(e) => update('status', e.target.value)}><option value="active">Attivo</option><option value="inactive">Archiviato</option></select></label>
      </section>
      <section className="grid gap-4 border-t border-line pt-5">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-brand-700">Note interne</p>
        </div>
        <label className="text-sm font-semibold">Note<textarea className="form-input mt-1 min-h-24" value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} /></label>
      </section>
      <div className="flex flex-wrap gap-3 border-t border-line pt-4">
        <button className="btn-primary" disabled={saving}>{saving ? 'Salvataggio...' : 'Salva cliente'}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annulla</button>
      </div>
    </form>
  );
}
