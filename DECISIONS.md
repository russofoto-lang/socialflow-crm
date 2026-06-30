# Decisioni di progetto

## React + Vite + Tailwind
Il frontend usa React con Vite per avere una base leggera, veloce da sviluppare e semplice da estendere. Tailwind CSS e stato scelto per costruire rapidamente una UI coerente senza introdurre un design system pesante nella prima fase.

## Supabase reale
Il progetto usa Supabase reale per Auth, Database e Storage. La scelta permette di avere subito autenticazione, persistenza dati, policy RLS e file upload senza costruire un backend custom nella fase iniziale.

## CRM single-agency
Il prodotto e pensato per una sola agenzia o un singolo social media manager che gestisce piu clienti. Non viene introdotta una struttura multi-agenzia per evitare complessita prematura.

## Solo italiano
L'app e la documentazione operativa sono in italiano, per mantenere coerenza con il pubblico iniziale e ridurre attrito nell'uso quotidiano.

## Ruoli iniziali Admin e Cliente
La prima versione prevede solo due ruoli:
- Admin, con accesso alla gestione completa.
- Cliente, con accesso limitato ai propri contenuti.

Il ruolo team interno non viene introdotto nella prima fase.

## No multi-agenzia per ora
La multi-agenzia e esclusa perche richiederebbe isolamento dati piu complesso, gestione organizzazioni, inviti e permessi avanzati. Potra essere valutata solo dopo validazione del prodotto single-agency.

## No AI nella prima fase
Le funzioni AI sono rimandate. La priorita iniziale e avere un flusso CRM solido: clienti, contenuti, board, calendario e approvazioni.

## No notifiche email nella prima fase
Le notifiche email automatiche sono escluse per evitare configurazioni premature e possibili problemi di consegna. Prima va stabilizzato il flusso manuale.

## Sviluppo incrementale per versioni
Il progetto procede per versioni piccole e verificabili. Ogni versione deve avere obiettivo, funzioni previste, esclusioni e criteri di completamento chiari.
