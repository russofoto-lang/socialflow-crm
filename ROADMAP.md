# Roadmap SocialFlow CRM

## v0.1 Base CRM funzionante

### Obiettivo
Creare una prima base operativa del CRM per gestire clienti, contenuti social, board, calendario e approvazioni essenziali.

### Funzioni previste
- Login con Supabase Auth.
- Dashboard Admin.
- CRUD clienti.
- CRUD contenuti.
- Board per stato contenuto.
- Calendario editoriale mensile.
- Area Cliente iniziale.
- Database Supabase reale con dati demo.

### Cose escluse
- Automazioni avanzate.
- AI Assistant.
- Pubblicazione automatica sui social.
- Integrazioni Meta/Instagram.
- Notifiche email.
- Multi-agenzia.

### Criteri di completamento
- Admin puo accedere e gestire clienti e contenuti.
- Cliente puo vedere i propri contenuti.
- Cambio stato contenuti funzionante.
- Supabase configurato con migration e seed demo.

## v0.2 Miglioramento UX/UI e stabilizzazione - completata

### Obiettivo
Rendere l'app piu stabile, chiara e piacevole da usare nella gestione quotidiana.

### Funzioni previste
- Miglioramento responsive mobile.
- Stati loading/error piu uniformi.
- Messaggi di conferma per azioni importanti.
- Miglioramento filtri contenuti.
- Revisione accessibilita base.
- Pulizia visuale di tabelle, board e calendario.

### Cose escluse
- Nuove integrazioni esterne.
- Funzioni AI.
- Workflow complessi di approvazione.

### Criteri di completamento
- Flussi principali testati manualmente.
- Errori principali mostrati in modo leggibile.
- UI coerente tra desktop e mobile.
- Ricerca clienti e contenuti disponibile.
- Dashboard, board e calendario piu leggibili.

## v0.3 Area Cliente

### Obiettivo
Rendere l'area cliente piu completa e semplice da usare per revisione e consultazione contenuti.

### Funzioni previste
- Home cliente dedicata.
- Vista contenuti da approvare.
- Storico contenuti approvati/pubblicati.
- Calendario cliente migliorato.
- Visualizzazione allegati piu chiara.

### Cose escluse
- Chat realtime.
- Notifiche email automatiche.
- Accesso multi-cliente per lo stesso utente.

### Criteri di completamento
- Cliente vede solo i propri dati.
- Cliente trova facilmente contenuti da approvare.
- Storico e calendario sono consultabili da mobile.

## v0.4 Approvazioni contenuti

### Obiettivo
Formalizzare il ciclo di approvazione cliente in modo affidabile e tracciabile.

### Funzioni previste
- Approva contenuto.
- Richiedi modifiche con commento obbligatorio.
- Tracciamento data e utente approvatore.
- Badge approvazione chiari.
- Vista Admin dei contenuti da revisionare.

### Cose escluse
- Firme digitali.
- Workflow multi-step.
- Approvazioni multiple da piu stakeholder.

### Criteri di completamento
- Approvazione aggiorna solo i campi necessari.
- Richiesta modifiche torna visibile all'Admin.
- Storico approvazione consultabile.

## v0.5 Chat/commenti per contenuto

### Obiettivo
Centralizzare le conversazioni relative a ogni contenuto.

### Funzioni previste
- Commenti cliente per contenuto.
- Commenti interni Admin.
- Lista commenti ordinata.
- Distinzione visiva tra commenti interni e cliente.

### Cose escluse
- Chat realtime complessa.
- Mention utenti.
- Notifiche email o push.

### Criteri di completamento
- Commenti salvati e collegati al contenuto.
- Cliente puo commentare solo contenuti propri.
- Admin vede tutti i commenti.

## v0.6 Export PDF piano editoriale

### Obiettivo
Consentire all'agenzia di esportare un piano editoriale condivisibile.

### Funzioni previste
- Export PDF per cliente.
- Export PDF per mese.
- Layout leggibile con date, titoli, piattaforme e stati.
- Filtri prima dell'export.

### Cose escluse
- Firma o approvazione del PDF.
- Export automatici programmati.
- Invio email automatico.

### Criteri di completamento
- PDF generato correttamente.
- Contenuti ordinati per data.
- Export coerente con filtri scelti.

## v0.7 AI Assistant

### Obiettivo
Introdurre supporto AI come assistente operativo, senza sostituire il lavoro umano.

### Funzioni previste
- Suggerimenti copy.
- Idee contenuto.
- Riformulazione testi.
- Checklist qualita contenuto.

### Cose escluse
- Pubblicazione automatica.
- Decisioni autonome.
- Generazione massiva senza revisione umana.

### Criteri di completamento
- AI usabile come supporto opzionale.
- Output sempre modificabile dall'Admin.
- Nessuna automazione critica senza conferma.

## v1.0 Prima versione utilizzabile realmente

### Obiettivo
Rilasciare una versione stabile, sicura e utilizzabile da una piccola agenzia o social media manager.

### Funzioni previste
- Flussi Admin e Cliente completi.
- Gestione account cliente sicura.
- RLS consolidata.
- UI stabile su desktop e mobile.
- Export piano editoriale.
- Commenti e approvazioni affidabili.
- Documentazione aggiornata.

### Cose escluse
- Multi-agenzia.
- Integrazioni social avanzate.
- Billing clienti.
- Gestione team interno complessa.

### Criteri di completamento
- Flusso end-to-end testato.
- Dati cliente isolati correttamente.
- App pronta per uso pilota reale.
