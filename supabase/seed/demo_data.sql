insert into public.clients (id, name, contact_name, email, phone, managed_brands, notes, status)
values
  ('11111111-1111-1111-1111-111111111111', 'Ristorante Aurora', 'Giulia Bianchi', 'giulia@ristoranteaurora.it', '+39 333 100 2000', 'Instagram, Facebook', 'Tono caldo, focus su menu stagionale.', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Studio Dentistico Verdi', 'Marco Verdi', 'studio@dentisticoverdi.it', '+39 333 200 3000', 'Instagram, Facebook', 'Comunicazione rassicurante e professionale.', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Palestra Energia', 'Elena Rossi', 'elena@palestraenergia.it', '+39 333 300 4000', 'Instagram', 'Visual dinamici e copy motivazionali.', 'active')
on conflict (id) do nothing;

insert into public.contents (id, client_id, title, content_type, platform, copy_text, internal_notes, scheduled_date, status, approval_status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Post promozionale menu estate', 'post', 'instagram_facebook', 'Scopri il nuovo menu estivo del Ristorante Aurora.', 'Inserire foto piatto principale.', current_date + 2, 'to_approve', 'pending'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', 'Reel backstage cucina', 'reel', 'instagram', 'Dietro le quinte della preparazione serale.', 'Montaggio rapido, 15 secondi.', current_date + 5, 'in_progress', 'not_required'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '22222222-2222-2222-2222-222222222222', 'Carosello consigli igiene orale', 'carousel', 'instagram_facebook', '5 abitudini quotidiane per un sorriso sano.', 'Grafica pulita con icone semplici.', current_date + 8, 'todo', 'not_required'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '33333333-3333-3333-3333-333333333333', 'Stories offerta settimanale', 'stories', 'instagram', 'Promo prova gratuita fino a venerdi.', 'Usare colori energici.', current_date + 1, 'ideas', 'not_required'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '33333333-3333-3333-3333-333333333333', 'Post trasformazione cliente', 'post', 'instagram', 'Ogni percorso inizia da una scelta.', 'Verificare liberatoria foto.', current_date - 2, 'published', 'approved')
on conflict (id) do nothing;
