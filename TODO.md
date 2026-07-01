# TODO

## Alta
- Completare flusso sicuro per creazione account cliente tramite Edge Function o backend admin.
- Rafforzare le policy RLS sulle azioni cliente.
- Testare flusso completo Admin -> Cliente -> Approvazione -> Revisione.
- Migliorare gestione errori su upload e approvazioni cliente.
- Rendere privato il bucket Storage e usare signed URL.

## Media
- Migliorare UX mobile dell'area cliente.
- Separare meglio commenti interni e commenti cliente.
- Aggiungere ordinamenti nelle tabelle.
- Valutare filtri rapidi piu evoluti nella scheda cliente se il numero di contenuti cresce molto.
- Valutare una vista agenda settimanale se il calendario mensile contiene molti contenuti per giorno.
- Aggiungere indicatori operativi simili a Dashboard anche sulle card Board e Calendario.
- Estendere gradualmente `useContentActions()` con update ottimistici, evitando refresh completi dopo ogni mutazione.
- Ottimizzare in una prossima release le query piu pesanti partendo dai moduli `dashboardApi.js` e `contentsApi.js`.
- Introdurre query leggere per ricerca globale, dashboard, board e calendario.

## Bassa
- Preparare template PDF piano editoriale.
- Aggiungere piccole preferenze UI.
- Rendere i feedback temporanei o dismissible.
- Valutare una vista compatta/densa per tabelle con molti contenuti.
- Valutare scorciatoie da tastiera per ricerca globale.

## Futuro
- AI Assistant per idee e copy.
- Export PDF avanzato.
- Notifiche email.
- Integrazioni Meta/Instagram.
- Pubblicazione automatica sui social.
- Ruolo team interno.
- Multi-agenzia, solo se il prodotto lo richiedera.
