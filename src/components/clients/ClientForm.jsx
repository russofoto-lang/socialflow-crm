import { useEffect, useState } from 'react';

const emptyClient = {
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  managed_brands: '',
  notes: '',
  status: 'active'
};

export default function ClientForm({ initialValue, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyClient);

  useEffect(() => {
    setForm(initialValue ?? emptyClient);
  }, [initialValue]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <form
      className="surface grid gap-6 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...form, name: form.name.trim(), email: form.email?.trim() });
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
        <label className="text-sm font-semibold">Referente<input className="form-input mt-1" value={form.contact_name ?? ''} onChange={(e) => update('contact_name', e.target.value)} /></label>
        <label className="text-sm font-semibold">Email<input className="form-input mt-1" type="email" value={form.email ?? ''} onChange={(e) => update('email', e.target.value)} /></label>
        <label className="text-sm font-semibold">Telefono<input className="form-input mt-1" value={form.phone ?? ''} onChange={(e) => update('phone', e.target.value)} /></label>
      </section>
      <section className="grid gap-4 border-t border-line pt-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-brand-700">Informazioni operative</p>
        </div>
        <label className="text-sm font-semibold">Brand/social gestiti<input className="form-input mt-1" value={form.managed_brands ?? ''} onChange={(e) => update('managed_brands', e.target.value)} /></label>
        <label className="text-sm font-semibold">Stato<select className="form-input mt-1" value={form.status} onChange={(e) => update('status', e.target.value)}><option value="active">Attivo</option><option value="inactive">Non attivo</option></select></label>
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
