# Architecture Notes - SocialFlow CRM

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

