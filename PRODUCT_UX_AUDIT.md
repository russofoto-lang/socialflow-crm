# Product UX Audit - SocialFlow CRM

Ruolo audit: Product Designer ispirato a Notion, Linear e ClickUp  
Prospettiva: Social Media Manager professionista  
Vincolo: analisi prodotto/UX, non analisi codice  

## Sintesi

SocialFlow CRM ha gia' le basi giuste: clienti, contenuti, board, calendario e dashboard. La direzione e' buona, ma l'esperienza deve diventare piu' operativa: meno navigazione, meno inserimento manuale ripetitivo, piu' contesto immediato e piu' azioni rapide.

Il problema principale non e' la mancanza di funzioni isolate, ma il flusso quotidiano: un Social Media Manager deve capire in pochi secondi cosa fare oggi, cosa e' bloccato, cosa va pubblicato, cosa manca e per quale cliente.

---

## 1. Dashboard ancora poco azionabile

Priorita': Molto alta

Stato v0.5: risolto in prima versione con "Priorita' di oggi", "Prossimi 7 giorni" e "Clienti da seguire". Restano da estendere gli stessi segnali operativi a Board e Calendario.

### Problema

La dashboard mostra numeri e liste, ma non guida davvero la giornata. Un Social Media Manager si aspetta una vista tipo "oggi devo fare queste cose", non solo riepiloghi.

### Impatto

L'utente deve entrare in Board, Calendario o Contenuti per capire il lavoro reale. Questo crea attrito ogni mattina.

### Miglioramento ad alto impatto

Creare una sezione principale "Oggi / Questa settimana" con azioni ordinate per urgenza:

- contenuti da pubblicare oggi;
- contenuti da approvare;
- contenuti senza copy;
- contenuti senza immagine;
- contenuti programmati nei prossimi 7 giorni;
- clienti senza contenuti futuri.

Formato consigliato:

```text
Priorita' di oggi
1. 2 contenuti da approvare
2. 3 post senza immagine
3. 1 contenuto previsto oggi
4. Cliente X non ha contenuti programmati
```

Stile Notion/Linear: lista pulita, cliccabile, con CTA diretta.

---

## 2. Manca una inbox operativa per le idee

Priorita': Molto alta

### Problema

Nel lavoro reale arrivano idee sparse: messaggi WhatsApp, appunti, richieste cliente, brief vocali, bozze. Oggi sembra necessario creare subito un contenuto strutturato.

### Impatto

Il Social Media Manager rischia di perdere idee o di creare contenuti incompleti troppo presto.

### Miglioramento ad alto impatto

Aggiungere una "Inbox Idee" o "Raccolta rapida":

- titolo libero;
- cliente opzionale;
- nota/testo;
- allegato opzionale;
- tag opzionale;
- bottone "Trasforma in contenuto".

Questa diventerebbe il punto di ingresso naturale prima della Board.

Flusso ideale:

```text
Idea grezza -> assegna cliente -> trasforma in post/reel/stories -> entra in Board
```

---

## 3. Creazione contenuto troppo form-based

Priorita': Alta

### Problema

Il form contenuto richiede diversi campi subito. Per un uso quotidiano, a volte si vuole creare velocemente una bozza e completarla dopo.

### Impatto

Il processo sembra piu' amministrativo che creativo.

### Miglioramento ad alto impatto

Introdurre due modalita':

1. Creazione rapida
   - titolo
   - cliente
   - tipo
   - data opzionale

2. Scheda completa
   - copy
   - immagine/file
   - note interne
   - stato
   - approvazione

Pattern Notion/ClickUp: prima catturi l'elemento, poi lo arricchisci.

---

## 4. Board utile, ma manca contesto di priorita'

Priorita': Alta

### Problema

La Board mostra lo stato, ma non segnala cosa e' urgente o bloccato. Tutte le card sembrano avere lo stesso peso.

### Impatto

Con molti contenuti, l'utente deve leggere ogni card per decidere cosa fare.

### Miglioramento ad alto impatto

Aggiungere indicatori visivi:

- scadenza oggi;
- scadenza passata;
- manca immagine;
- manca copy;
- in attesa cliente;
- priorita' alta.

Esempi:

```text
⚠ Scaduto
Oggi
Senza immagine
In attesa approvazione
```

Questi badge rendono la Board molto piu' operativa.

---

## 5. Calendario buono, ma manca vista agenda settimanale

Priorita': Alta

### Problema

La vista mensile e' utile per pianificazione, ma il lavoro operativo spesso avviene su settimana corrente/prossima settimana.

### Impatto

La vista mensile puo' disperdere l'attenzione.

### Miglioramento ad alto impatto

Aggiungere una vista "Settimana" o "Agenda":

```text
Lunedi'
- Post cliente A
- Reel cliente B

Martedi'
- Stories cliente C
```

Deve essere compatta, con drag & drop tra giorni.

Vista consigliata:

- toggle: Mese / Settimana / Lista;
- default operativo: Settimana;
- default pianificazione: Mese.

---

## 6. Scheda cliente migliorata, ma manca "salute cliente"

Priorita': Alta

### Problema

La scheda cliente contiene dati e statistiche, ma non risponde alla domanda chiave: "questo cliente e' sotto controllo?"

### Impatto

Un SMM deve capire rapidamente quali clienti sono scoperti, fermi o in ritardo.

### Miglioramento ad alto impatto

Aggiungere una sezione "Salute cliente":

- contenuti programmati nei prossimi 7 giorni;
- ultimo contenuto pubblicato;
- prossima pubblicazione;
- contenuti in approvazione;
- contenuti mancanti di asset;
- note operative importanti.

Badge sintetico:

```text
In ordine
Da seguire
Scoperto
```

---

## 7. Mancano template per contenuti ricorrenti

Priorita': Alta

### Problema

Molti contenuti social sono ricorrenti: promo settimanale, menu, rubrica, reminder evento, post recensione, carosello tips.

### Impatto

L'utente ricrea manualmente contenuti simili.

### Miglioramento ad alto impatto

Aggiungere template:

- Post promozionale
- Reel backstage
- Stories offerta
- Carosello consigli
- Evento
- Recensione

Quando crei un contenuto, puoi scegliere un template che precompila:

- tipo;
- piattaforma;
- struttura copy;
- checklist asset.

---

## 8. Mancano checklist operative per contenuto

Priorita': Media-alta

### Problema

Una scheda contenuto ha copy, file e note, ma non una checklist chiara di completamento.

### Impatto

Rischio di pubblicare contenuti incompleti o dimenticare passaggi.

### Miglioramento ad alto impatto

Checklist standard:

- copy pronto;
- immagine/video caricato;
- hashtag verificati;
- cliente approvato;
- data pubblicazione impostata;
- piattaforma corretta.

La card puo' mostrare progresso:

```text
4/6 completato
```

---

## 9. Ricerca globale utile, ma deve diventare command palette

Priorita': Media-alta

### Problema

La ricerca trova clienti/contenuti, ma in un tool operativo dovrebbe anche permettere azioni rapide.

### Impatto

L'utente naviga troppo.

### Miglioramento ad alto impatto

Trasformare la ricerca in command palette:

- "crea post"
- "cliente Aurora"
- "contenuti da approvare"
- "calendario luglio"
- "nuovo cliente"

Shortcut consigliato:

```text
Ctrl + K
```

Pattern Linear/Notion: ricerca + comandi.

---

## 10. Manca una vista "Cliente x Mese"

Priorita': Media-alta

### Problema

Un SMM spesso lavora per cliente e mese: "cosa abbiamo previsto per Ristorante Aurora a luglio?"

### Impatto

Oggi bisogna combinare filtri e calendario/lista.

### Miglioramento ad alto impatto

Aggiungere vista piano editoriale cliente:

- seleziona cliente;
- seleziona mese;
- visualizza contenuti ordinati per data;
- mostra copertura per piattaforma;
- evidenzia giorni vuoti.

Questa vista diventerebbe utile anche per export futuro.

---

## 11. Upload media presente, ma manca gestione asset

Priorita': Media

### Problema

Si possono caricare file, ma non sembra esserci una libreria asset per cliente.

### Impatto

Foto, loghi, materiali e grafiche rischiano di disperdersi nelle singole schede contenuto.

### Miglioramento ad alto impatto

Aggiungere "Asset cliente":

- loghi;
- foto prodotto;
- foto location;
- grafiche;
- documenti brand;
- link Canva/Drive.

Poi nella creazione contenuto si puo' scegliere asset gia' presenti.

---

## 12. Approvazione cliente da rendere piu' visibile

Priorita': Media

### Problema

L'approvazione esiste, ma lato admin deve essere piu' evidente cosa e' in attesa cliente e da quanto tempo.

### Impatto

Le approvazioni sono uno dei colli di bottiglia principali nel lavoro social.

### Miglioramento ad alto impatto

Aggiungere:

- "In attesa da X giorni";
- filtro "bloccati da cliente";
- reminder manuale;
- sezione dashboard "Approvazioni ferme".

---

## 13. Mancano viste salvate

Priorita': Media

### Problema

L'utente deve reimpostare filtri e ordinamenti.

### Impatto

Click ripetitivi.

### Miglioramento ad alto impatto

Viste salvate:

- Da fare oggi
- Da approvare
- Senza data
- Senza asset
- Cliente attivo
- Pubblicati questo mese

Stile ClickUp/Linear: filtri predefiniti e salvabili.

---

## 14. Stati contenuto da chiarire meglio

Priorita': Media

### Problema

Gli stati attuali sono buoni, ma manca una distinzione esplicita tra:

- bozza creativa;
- pronto internamente;
- inviato al cliente;
- approvato;
- pubblicato.

### Impatto

Possibile ambiguita' su "Da approvare": approvazione interna o cliente?

### Miglioramento ad alto impatto

Separare due concetti:

- stato lavorazione;
- stato approvazione.

E renderli entrambi visibili in card/scheda.

---

## 15. Mobile: privilegiare agenda e azioni rapide

Priorita': Media

### Problema

Board e calendario sono naturalmente complessi su mobile.

### Impatto

Da telefono l'utente probabilmente vuole controllare, non pianificare massivamente.

### Miglioramento ad alto impatto

Su mobile default:

- agenda oggi/settimana;
- contenuti da approvare;
- ricerca;
- crea idea rapida.

Board drag/drop e calendario mensile possono restare secondari.

---

## Roadmap UX consigliata

### Fase 1 - Massimo impatto operativo

1. Dashboard "Priorita' di oggi".
2. Indicatori mancanti/scaduti sulle card.
3. Vista agenda settimanale.
4. Inbox idee rapide.
5. Checklist contenuto.

### Fase 2 - Lavoro per cliente

1. Salute cliente.
2. Piano editoriale Cliente x Mese.
3. Asset cliente.
4. Template contenuti.

### Fase 3 - Velocita' avanzata

1. Command palette.
2. Viste salvate.
3. Approvazioni ferme e reminder.
4. Mobile agenda-first.

---

## Le 5 modifiche piu' importanti

1. Dashboard con "Priorita' di oggi".
2. Card contenuto con badge operativi: scaduto, senza asset, senza copy, in attesa.
3. Vista agenda settimanale.
4. Inbox idee rapide trasformabile in contenuto.
5. Scheda cliente con salute cliente e prossima copertura editoriale.

Queste cinque modifiche renderebbero l'app molto piu' vicina a uno strumento quotidiano da Social Media Manager professionista.
