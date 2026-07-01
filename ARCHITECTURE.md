# Architecture Notes - SocialFlow CRM

## v0.5.0 - Dashboard operativa

La release v0.5 introduce una dashboard piu orientata al lavoro quotidiano senza cambiare schema, RLS o API pubbliche.

Nuovi componenti:

```txt
src/components/dashboard/
  PriorityToday.jsx
  UpcomingWeek.jsx
  ClientsToFollow.jsx
  DashboardStatCards.jsx
```

Responsabilita':

- `PriorityToday.jsx`: mostra le categorie operative in ordine di urgenza.
- `UpcomingWeek.jsx`: lista i contenuti programmati nei prossimi 7 giorni con warning su copy/media.
- `ClientsToFollow.jsx`: evidenzia clienti attivi senza contenuti futuri.
- `DashboardStatCards.jsx`: mantiene le statistiche sintetiche gia' presenti.

Decisione: i dati sono ancora ricavati da `listClients()` e `listContents()` per mantenere compatibilita' con v0.4.3. Il calcolo delle priorita usa `useMemo` in `AdminDashboard.jsx` per evitare ricalcoli inutili durante i render.

## v0.4.3 - Quick wins performance

La release v0.4.3 applica ottimizzazioni leggere senza cambiare comportamento prodotto o API pubbliche.

Interventi:

- route principali caricate con `React.lazy` e `Suspense`;
- Board: mappa memoizzata `contentsByStatus` per evitare filtri ripetuti a ogni render;
- Calendario: grouping memoizzato dei contenuti per data;
- Global Search: caricamento dati spostato da mount iniziale a focus/query utile, con debounce;
- Supabase: migration con indici idempotenti sulle colonne piu usate.

Decisione: non sono state introdotte paginazione completa, query server-side nuove o separazione dei select leggeri. Questi punti restano candidati per v0.4.4/v0.5 per evitare regressioni in una release quick win.

## v0.4.2 - API layer modulare

La release v0.4.2 spezza `src/lib/crmApi.js` in moduli piu piccoli, mantenendo invariata l'API pubblica usata dalle pagine.

## Struttura API

```txt
src/lib/api/
  clientsApi.js
  contentsApi.js
  commentsApi.js
  filesApi.js
  profilesApi.js
  dashboardApi.js
  approvalsApi.js
  index.js
```

Responsabilita':

- `clientsApi.js`: lettura, salvataggio, eliminazione e stato clienti.
- `contentsApi.js`: query contenuti, dettaglio, salvataggio, duplicazione, eliminazione e cambio stato.
- `commentsApi.js`: creazione commenti.
- `filesApi.js`: upload file contenuto e URL pubblica.
- `profilesApi.js`: profilo utente e cliente collegato.
- `approvalsApi.js`: approvazione contenuto e richiesta modifiche.
- `dashboardApi.js`: spazio riservato a future query aggregate della dashboard.
- `index.js`: export unico dei moduli API.

`src/lib/crmApi.js` resta come facciata di compatibilita':

```js
export * from './api/index';
```

## Decisione

Non sono state modificate query, filtri, RLS o schema Supabase. Il refactor e' solo organizzativo: riduce la dimensione di `crmApi.js` e prepara il codice a ottimizzazioni successive senza forzare una migrazione degli import nelle pagine.

## Prossimo passo consigliato

La v0.4.3 puo' lavorare su query piu mirate e paginazione lato API, partendo da `dashboardApi.js` e dalle liste contenuti piu pesanti.

## v0.4.1 - Centralizzazione azioni contenuto

La release v0.4.1 introduce `src/hooks/useContentActions.js` per ridurre la duplicazione della logica contenuto nelle pagine admin.

## Problema

Le pagine:

- `AdminDashboard.jsx`
- `ContentsPage.jsx`
- `BoardPage.jsx`
- `CalendarPage.jsx`

avevano logiche molto simili per:

- apertura/chiusura dettaglio contenuto;
- salvataggio contenuto;
- eliminazione contenuto;
- duplicazione contenuto;
- cambio stato;
- refresh dopo mutazione;
- gestione `saving`, `error`, `success`.

Questa duplicazione rendeva piu' rischioso ogni cambiamento sul ciclo di vita dei contenuti.

## Decisione

E' stato introdotto l'hook:

```js
useContentActions()
```

Responsabilita' dell'hook:

- `selectedContent`
- `openContentDetail(content)`
- `closeContentDetail()`
- `saveContent(payload)`
- `deleteContent(content)`
- `duplicateContent(content)`
- `changeContentStatus(id, status)`
- `saving`
- `error`
- `success`
- callback `refresh` configurabile
- callback opzionali `onAfterSave`, `onAfterDelete`, `onAfterDuplicate`, `onAfterStatusChange`

L'hook mantiene volutamente un'API semplice e compatibile con il comportamento attuale.

## Cosa resta locale

Alcune logiche restano nelle pagine per evitare astrazioni premature.

### `ContentsPage.jsx`

Restano locali:

- filtri contenuto;
- ricerca testuale;
- ordinamento;
- query param `content` e `client_id`;
- apertura/chiusura form inline di creazione.

Motivo: sono comportamenti specifici della pagina Contenuti.

### `CalendarPage.jsx`

Restano locali:

- mese corrente;
- giorno selezionato;
- form modal di creazione da giorno;
- drag & drop calendario;
- nota interna automatica quando un contenuto viene spostato.

Motivo: lo spostamento calendario non e' un semplice cambio data; aggiunge audit testuale nelle note interne.

### `BoardPage.jsx`

Restano locali:

- filtro cliente;
- scrollbar orizzontale sincronizzata;
- layout colonne.

Motivo: sono dettagli di layout e interazione della Board.

### `AdminDashboard.jsx`

Restano locali:

- calcolo statistiche dashboard;
- ultime card;
- commenti recenti.

Motivo: sono dati aggregati specifici della dashboard.

## Regole future

Prima di aggiungere nuove azioni sui contenuti:

1. verificare se appartengono a `useContentActions`;
2. evitare duplicazione nelle pagine;
3. mantenere nelle pagine solo layout, filtri e logiche specifiche;
4. non introdurre update ottimistici finche' non vengono gestiti in modo uniforme.

## Prossimo passo consigliato

Estendere l'hook con update ottimistici per ridurre i refresh completi dopo ogni mutazione.
