# SocialFlow CRM

Prima base funzionante di un CRM single-agency per social media manager e agenzie social. L'app gestisce clienti, contenuti, board operativa, calendario editoriale, login Supabase e area approvazione cliente.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase Auth, Database e Storage

## Avvio locale

1. Installa le dipendenze:

```bash
npm install
```

2. Copia `.env.example` in `.env` e inserisci le chiavi Supabase:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Avvia il progetto:

```bash
npm run dev
```

## Configurazione Supabase

1. Crea un progetto Supabase.
2. Esegui `supabase/migrations/001_initial_schema.sql` nel SQL Editor.
3. Esegui `supabase/seed/demo_data.sql` per caricare clienti e contenuti demo.
4. Crea gli utenti in Supabase Auth.
5. Inserisci i record in `profiles` collegando ogni utente Auth:

```sql
insert into public.profiles (id, full_name, role, client_id)
values
  ('AUTH_USER_ID_ADMIN', 'Admin SocialFlow', 'admin', null),
  ('AUTH_USER_ID_CLIENTE', 'Cliente Aurora', 'client', '11111111-1111-1111-1111-111111111111');
```

Il bucket Storage `content-files` viene creato dalla migration.

## Credenziali demo suggerite

Supabase Auth non permette di creare password sicure dal frontend admin senza una funzione server. Crea manualmente questi utenti nel pannello Supabase Auth:

- `admin@socialflow.test` con ruolo `admin` in `profiles`
- `cliente.aurora@socialflow.test` collegato a `Ristorante Aurora`

## Flusso supportato

Admin: login, dashboard, CRUD clienti, CRUD contenuti, upload file, cambio stato, board e calendario.

Cliente: login, contenuti del proprio cliente, commenti, approvazione, richiesta modifiche obbligando un commento, calendario e storico.

## Limiti tecnici della prima versione

- La creazione account cliente è predisposta ma va completata con Supabase Admin API via Edge Function o procedura backend.
- Il cambio stato nella board usa una select invece del drag and drop.
- I file del bucket sono pubblici nella prima versione per semplicità di anteprima; si può rendere il bucket privato con URL firmati.
- La policy RLS cliente limita l'accesso per cliente, ma per blindare i singoli campi aggiornabili conviene aggiungere una funzione RPC dedicata alle approvazioni.

## Prossimi step consigliati

- Edge Function per creare utenti cliente da area admin.
- RPC `approve_content` e `request_content_changes` per restringere gli update cliente ai soli campi approvazione.
- Bucket privato con signed URL.
- Drag and drop nella board.
- Test end-to-end per flusso admin/cliente.
