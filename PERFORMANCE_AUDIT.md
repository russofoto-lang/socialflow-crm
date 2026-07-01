# Performance Audit - SocialFlow CRM v0.3.3

Ruolo audit: Senior Performance Engineer  
Data: 2026-07-01  
Scope: rendering React, query Supabase, re-render, bundle, lazy loading, memoizzazione, caricamenti.

## Executive Summary

L'app e' performante per un dataset piccolo, ma la crescita di clienti, contenuti, file e commenti portera' rapidamente a rallentamenti percepibili. Il rischio principale e' che molte pagine caricano collezioni complete da Supabase e poi filtrano, ordinano e aggregano lato browser.

Il bundle production attuale e' circa:

- JS: `515 KB` minificato
- CSS: `30 KB`

Il warning Vite sul chunk JS sopra 500 KB e' gia' presente. Non e' bloccante ora, ma indica che e' il momento giusto per introdurre lazy loading delle route.

---

## 1. Query Supabase troppo ampie su `contents`

Priorita': Critica  
Area: Supabase, caricamenti, rendering  
File principali:

- `src/lib/crmApi.js`
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/BoardPage.jsx`
- `src/pages/admin/CalendarPage.jsx`
- `src/pages/admin/ContentsPage.jsx`
- `src/components/layout/GlobalSearch.jsx`

### Problema

`listContents()` usa:

```js
supabase.from('contents').select(contentSelect).order('scheduled_date', { ascending: true })
```

e `contentSelect` include:

```sql
*,
clients:client_id(id,name,status),
content_files(*),
comments(*, profiles:user_id(full_name,role))
```

Questo significa che molte schermate scaricano sempre contenuti, file e commenti, anche quando non servono.

### Impatto

Al crescere dei dati:

- Dashboard scarica troppi record per mostrare poche card.
- Board scarica anche commenti/file non necessari per cambiare stato.
- Calendario scarica commenti e file anche se mostra solo titolo/piattaforma/stato.
- Ricerca globale carica tutto all'avvio.

### Raccomandazione

Separare query leggere e query dettagliate:

- `listContentSummaries()`
- `listCalendarContents()`
- `listBoardContents()`
- `getContentDetail(id)`
- `listDashboardStats()`

Esempio:

```js
const boardSelect = `
  id,title,client_id,status,platform,content_type,scheduled_date,copy_text,
  clients:client_id(id,name)
`;
```

---

## 2. Nessuna paginazione o limit server-side

Priorita': Critica  
Area: Supabase, memoria browser, UX  
File principali:

- `src/lib/crmApi.js`
- `src/pages/admin/ContentsPage.jsx`
- `src/pages/admin/ClientsPage.jsx`
- `src/components/layout/GlobalSearch.jsx`

### Problema

Clienti e contenuti vengono caricati senza `limit`, `range` o paginazione. Anche la ricerca globale carica tutto e filtra localmente.

### Impatto

Con molti contenuti:

- caricamento iniziale piu' lento;
- bundle JS occupato a filtrare/sortare;
- UI bloccata durante map/sort/filter;
- consumo banda non necessario.

### Raccomandazione

Introdurre paginazione progressiva:

```js
.range(page * pageSize, (page + 1) * pageSize - 1)
```

Per dashboard usare query con `limit`:

- ultimi 6 contenuti;
- prossimi 6 contenuti;
- ultimi 5 commenti.

---

## 3. Dashboard calcola statistiche lato client su tutti i contenuti

Priorita': Alta  
Area: rendering, Supabase, CPU client  
File:

- `src/pages/admin/AdminDashboard.jsx`

### Problema

La Dashboard chiama `listContents()` completo e poi calcola:

- commenti;
- contenuti programmati;
- contenuti da approvare;
- contenuti in lavorazione;
- ultimi contenuti;
- prossimi contenuti.

Tutto avviene lato client.

### Impatto

La dashboard e' la prima schermata admin: se diventa lenta, l'intera app sembra lenta.

### Raccomandazione

Creare query dedicate:

- `getDashboardCounts()`
- `listLatestContents(limit = 6)`
- `listUpcomingContents(limit = 6)`
- `listLatestClientComments(limit = 5)`

In Supabase si puo' usare `select(..., { count: 'exact', head: true })` per conteggi leggeri.

---

## 4. Bundle unico senza lazy loading route

Priorita': Alta  
Area: bundle, first load  
File:

- `src/App.jsx`

### Problema

Tutte le pagine admin e client sono importate staticamente:

```js
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ClientsPage from './pages/admin/ClientsPage.jsx';
...
```

Questo include nel bundle iniziale anche pagine non visitate.

### Impatto

Il JS minificato e' circa `515 KB`. Il first load peggiorera' con ogni nuova feature.

### Raccomandazione

Usare `React.lazy` e `Suspense` sulle route:

```js
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
```

Priorita' lazy:

1. pagine client;
2. calendario;
3. board;
4. detail modal se separabile.

---

## 5. Refresh completo dopo ogni mutazione

Priorita': Alta  
Area: Supabase, UX, rendering  
File:

- `AdminDashboard.jsx`
- `ContentsPage.jsx`
- `CalendarPage.jsx`
- `BoardPage.jsx`

### Problema

Dopo update, delete, duplicate, drag/drop o cambio stato viene spesso chiamato `refresh()`, che ricarica intere collezioni.

### Impatto

Ogni azione semplice puo' generare:

- nuova query clienti;
- nuova query contenuti;
- reload di file/commenti;
- re-render completo della pagina.

### Raccomandazione

Applicare update ottimistico locale:

- cambio stato: aggiornare solo il contenuto in memoria;
- delete: rimuovere id dalla lista;
- drag calendario: aggiornare `scheduled_date`;
- upload: aggiornare solo `content_files` del contenuto interessato.

Tenere `refresh()` come fallback o dopo errori.

---

## 6. `ContentDetailModal` montato in molte pagine

Priorita': Media-alta  
Area: rendering, bundle, duplicazione  
File:

- `AdminDashboard.jsx`
- `ContentsPage.jsx`
- `CalendarPage.jsx`
- `BoardPage.jsx`

### Problema

Il modal dettaglio contenuto viene importato e montato in molte pagine. Inoltre ogni pagina duplica le funzioni necessarie al modal.

### Impatto

- bundle piu' grande;
- logica ripetuta;
- piu' re-render;
- maggiore rischio di regressioni.

### Raccomandazione

Creare un provider o hook:

```js
useContentDetailModal()
```

Oppure un componente layout-level:

```jsx
<ContentDetailProvider />
```

Le pagine chiamano solo:

```js
openContent(content)
```

---

## 7. Board filtra per stato ripetutamente durante render

Priorita': Media  
Area: rendering React  
File:

- `src/pages/admin/BoardPage.jsx`

### Problema

Per ogni colonna:

```js
visibleContents.filter((content) => content.status === status.value)
```

Con 5 colonne, la lista viene attraversata 5 volte a ogni render.

### Impatto

Basso con pochi contenuti, medio con molti contenuti e drag/drop frequente.

### Raccomandazione

Memoizzare una mappa per stato:

```js
const contentsByStatus = useMemo(() => groupBy(visibleContents, 'status'), [visibleContents]);
```

Poi:

```js
contents={contentsByStatus[status.value] ?? []}
```

---

## 8. Calendario ricalcola grouping giornaliero a ogni render

Priorita': Media  
Area: rendering React  
File:

- `src/components/calendar/CalendarMonthView.jsx`

### Problema

`byDate` viene ricostruito a ogni render:

```js
const byDate = contents.reduce(...)
```

### Impatto

Medio se il calendario contiene molti contenuti o durante drag/drop.

### Raccomandazione

Usare `useMemo`:

```js
const byDate = useMemo(() => ..., [contents]);
```

Inoltre passare a `CalendarMonthView` solo contenuti del mese corrente quando possibile.

---

## 9. Ricerca globale carica dati completi all'avvio

Priorita': Media  
Area: caricamenti, query, memoria  
File:

- `src/components/layout/GlobalSearch.jsx`

### Problema

Al mount carica:

```js
Promise.all([listClients(), listContents()])
```

quindi anche file e commenti via `contentSelect`.

### Impatto

Ogni pagina con header admin paga il costo di ricerca globale, anche se l'utente non cerca.

### Raccomandazione

Caricare solo quando:

- input riceve focus;
- query >= 2 caratteri;
- con debounce 250 ms.

Creare endpoint/query lightweight:

- `searchClients(query)`
- `searchContents(query)`

---

## 10. Filtri e ordinamenti contenuti lato client

Priorita': Media  
Area: rendering, Supabase  
File:

- `src/pages/admin/ContentsPage.jsx`

### Problema

Alcuni filtri sono server-side, ma ricerca e ordinamento finale sono client-side.

### Impatto

Con dataset grande il browser esegue sort/filter su molti record.

### Raccomandazione

Spostare in Supabase:

- search con `ilike`;
- sort con `.order(field)`;
- paginazione.

Mantenere client-side solo per dataset piccoli o fallback.

---

## 11. Mancano indici Supabase per query frequenti

Priorita': Media  
Area: database  
File:

- `supabase/migrations/*.sql`

### Problema

Non risultano indici espliciti su colonne usate spesso:

- `contents.client_id`
- `contents.status`
- `contents.scheduled_date`
- `contents.created_at`
- `clients.status`

### Impatto

Le query peggiorano quando i record aumentano.

### Raccomandazione

Aggiungere migration con indici:

```sql
create index if not exists idx_contents_client_id on public.contents(client_id);
create index if not exists idx_contents_status on public.contents(status);
create index if not exists idx_contents_scheduled_date on public.contents(scheduled_date);
create index if not exists idx_contents_created_at on public.contents(created_at desc);
create index if not exists idx_clients_status on public.clients(status);
```

---

## 12. Componenti grandi causano re-render ampi

Priorita': Media-bassa  
Area: rendering React  
File:

- `CalendarPage.jsx`
- `AdminDashboard.jsx`
- `ContentsPage.jsx`
- `ClientDetailPage.jsx`

### Problema

Le pagine contengono molta logica e molti sottoalberi. Un cambio stato locale puo' ri-renderizzare l'intera pagina.

### Impatto

Ancora accettabile, ma peggiorera' con piu' contenuti.

### Raccomandazione

Estrarre sotto-componenti memoizzabili:

- `CalendarToolbar`
- `CalendarUpcomingList`
- `CalendarDayAgenda`
- `DashboardLatestContents`
- `DashboardUpcomingContents`
- `ClientContactsSection`
- `ClientSocialLinksSection`

Usare `React.memo` solo dopo aver separato componenti e misurato.

---

## 13. Drag & drop nativo puo' generare refresh eccessivi

Priorita': Media-bassa  
Area: UX/rendering  
File:

- `CalendarMonthView.jsx`
- `BoardCard.jsx`
- `BoardColumn.jsx`

### Problema

Il drag/drop aggiorna stato/data e poi spesso ricarica intere liste. Inoltre HTML5 drag/drop non e' ottimale su mobile.

### Impatto

Medio su desktop con molti contenuti; alto su mobile se il drag/drop diventa feature primaria.

### Raccomandazione

Per ora mantenibile. In futuro valutare `@dnd-kit/core` con update ottimistico locale.

---

## 14. Upload file non ottimizzato lato immagine

Priorita': Bassa-media  
Area: caricamenti, storage, UX  
File:

- `src/components/contents/UploadFile.jsx`
- `src/lib/crmApi.js`
- `src/components/contents/ContentPreview.jsx`

### Problema

Le immagini vengono caricate e mostrate da public URL senza trasformazioni o thumbnail dedicate.

### Impatto

Se si caricano immagini pesanti, preview e board possono diventare lente.

### Raccomandazione

Opzioni:

- limitare dimensione file lato client;
- comprimere immagini prima dell'upload;
- generare thumbnail;
- usare signed/public transformed URLs se disponibili.

---

## 15. Uso di `window.confirm` bloccante

Priorita': Bassa  
Area: UX/performance percepita  
File:

- diverse pagine admin

### Problema

`window.confirm` blocca il thread UI.

### Impatto

Basso, ma UX datata.

### Raccomandazione

Sostituire con modal conferma non bloccante.

---

## Piano consigliato

### Fase 1 - Quick wins

1. Lazy loading route.
2. Query lightweight per Dashboard, Board, Calendar.
3. Indici Supabase.
4. `useMemo` in `CalendarMonthView` per `byDate`.
5. Raggruppare Board per stato con `useMemo`.

### Fase 2 - Riduzione carico dati

1. Separare `contentSelect` in select specifiche.
2. Ricerca globale lazy + debounce + query server-side.
3. Paginazione in Contenuti.
4. Dashboard con count/query dedicate.

### Fase 3 - Architettura performance

1. Estrarre `useContentActions`.
2. Provider unico per `ContentDetailModal`.
3. Update ottimistico post-mutazione.
4. Thumbnail/ottimizzazione immagini.

---

## Priorita' finale

1. Ridurre `listContents()` e `contentSelect`.
2. Aggiungere paginazione/limit.
3. Lazy loading delle route.
4. Query dashboard dedicate.
5. Ricerca globale lazy/server-side.
6. Update ottimistico invece di refresh completo.
7. Indici Supabase.
8. Memoizzazione Calendar/Board.
9. Ottimizzazione immagini.
10. Pulizia UX secondaria.

