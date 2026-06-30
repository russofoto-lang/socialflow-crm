# Changelog

## v0.2 - Miglioramento UX/UI e stabilizzazione

### Aggiunto
- Card dashboard cliccabili verso Clienti, Contenuti, Board e Calendario.
- Ricerca clienti per nome, referente o email.
- Ricerca contenuti per titolo o copy.
- Feedback di successo per creazione, modifica, eliminazione e cambio stato.
- Conferma prima dell'eliminazione di clienti e contenuti.
- Lista contenuti programmati nella pagina Calendario.
- Stati vuoti, loading ed error state piu curati.

### Migliorato
- Sidebar desktop e menu mobile.
- Header e titoli pagina.
- Badge per stati, piattaforme, tipi contenuto e approvazioni.
- Tabelle Clienti e Contenuti.
- Form Cliente e Form Contenuto.
- Board responsive con colonne e card piu leggibili.
- Calendario mensile con giorni piu chiari e indicazione dei giorni senza contenuti.

### Stabilizzato
- Cambio stato contenuti mantenuto con update mirato.
- Gestione errori visibile nelle pagine Board, Clienti, Contenuti e Calendario.

## v0.1 - Base CRM funzionante

### Aggiunto
- Login Admin con Supabase Auth.
- Dashboard Admin.
- Clienti CRUD.
- Contenuti CRUD.
- Board per gestione stati.
- Calendario editoriale.
- Cambio stato contenuti.
- Supabase collegato.
- Database reale.
- Seed demo.

### Corretto
- Fix cambio stato contenuti con update mirato, evitando upsert incompleti e `client_id` nullo.
