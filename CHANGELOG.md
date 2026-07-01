# Changelog

## v0.3.1 - Calendario editoriale compatto

### Migliorato
- Vista mensile del calendario resa piu compatta e leggibile.
- Rimossa la scritta "Nessun contenuto" dalle celle vuote.
- Ogni giorno mostra al massimo 2 contenuti, con indicatore per gli altri elementi.
- Aggiunta evidenza del giorno selezionato.
- Aggiunta mini agenda "Giorno selezionato" con titolo, cliente, piattaforma, tipo e stato.
- La creazione contenuto dal calendario ora avviene in modal con data gia impostata.
- Il click su un contenuto apre il modal dettaglio contenuto, senza form inline e senza perdere lo scroll.
- Sezione "Prossimi 7 giorni" resa piu compatta.

### Stabilizzato
- Nessuna modifica a schema Supabase, migration o seed.
- Filtri cliente/stato e navigazione mese precedente/Oggi/mese successivo mantenuti.

## v0.3 - Statistiche e archiviazione cliente

### Aggiunto
- Scheda cliente piu completa con anagrafica, referente, contatti, brand/social, stato, note interne e brand voice se presente nello schema.
- Card statistiche per cliente calcolate dai contenuti collegati: totali, idee, da fare, in lavorazione, da approvare, pubblicati e programmati nei prossimi 7 giorni.
- Sezione "Contenuti recenti" nella scheda cliente con titolo, tipo, piattaforma, stato e data prevista.
- Link dai contenuti recenti al dettaglio contenuto tramite parametro URL stabile.
- Azione "Archivia cliente" e "Riattiva cliente" con conferma.
- Filtro "Mostra archiviati" nella pagina Clienti.

### Migliorato
- I clienti archiviati sono nascosti dalla lista principale di default.
- Lo stato `inactive` viene mostrato in interfaccia come "Archiviato".
- L'azione Archivia e' piu evidente e consigliata rispetto a Elimina.
- Link dalla scheda cliente alla pagina Contenuti filtrata per cliente.

### Stabilizzato
- Nessuna eliminazione dello storico cliente o dei contenuti collegati durante archiviazione/riattivazione.
- Nessuna nuova migration: la v0.3 riusa il campo esistente `clients.status` con valori `active` e `inactive`.
- Build produzione verificata con `npm run build`.

## v0.2.2 - Dettaglio contenuto, calendario e ricerca globale

### Aggiunto
- Dettaglio contenuto premium con vista di controllo, modifica, cambio stato, duplicazione, eliminazione e chiusura.
- Duplicazione contenuto con titolo preceduto da "Copia di" e stato iniziale "Idee".
- Ricerca globale admin nell'header per clienti e contenuti.
- Apertura diretta del dettaglio contenuto tramite parametro URL.
- Navigazione calendario con mese precedente, mese successivo e pulsante Oggi.
- Sezione "Prossimi 7 giorni" nel calendario.
- Riepilogo operativo sintetico nella dashboard.

### Migliorato
- Copy e note interne leggibili nel modal dettaglio.
- Preview/placeholder media nel dettaglio contenuto.
- Calendario piu comodo su desktop e mobile.
- Ricerca globale con risultati separati tra Clienti e Contenuti.

### Stabilizzato
- Cambio stato mantenuto con update mirato da Contenuti, Board e modal dettaglio.
- Nessuna modifica a schema Supabase, migration o seed.

## v0.2.1 - Rifinitura operativa e visuale

### Aggiunto
- Scorciatoie rapide piu evidenti nella dashboard.
- Filtro rapido per cliente nella Board.
- Preview media o placeholder elegante sulle card contenuto.
- Lista mobile sintetica nel calendario mensile.

### Migliorato
- Dashboard come centro di controllo quotidiano.
- Card contenuto con titolo, cliente, piattaforma, tipo, data e stato piu leggibili.
- Badge stato, piattaforma e tipo contenuto con colori piu coerenti.
- Board Kanban con colonne piu chiare e empty state meno grezzi.
- Calendario con piattaforma visibile nei contenuti giornalieri.
- Lista Clienti con avatar a iniziali.
- Form Cliente diviso in dati cliente, informazioni operative e note interne.

### Stabilizzato
- Cambio stato contenuti mantenuto invariato con update mirato.
- Nessuna modifica a schema Supabase, migration o seed.

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
