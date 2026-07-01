export function normalizePhone(value = '') {
  return value.replace(/[^\d+]/g, '');
}

export function whatsappUrl(value = '') {
  const normalized = normalizePhone(value).replace(/^\+/, '');
  return normalized ? `https://wa.me/${normalized}` : '';
}

export function websiteUrl(value = '') {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function normalizeContacts(client = {}) {
  const contacts = Array.isArray(client.contacts) ? client.contacts : [];
  const normalized = contacts
    .map((contact) => ({
      name: contact?.name ?? '',
      role: contact?.role ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? ''
    }))
    .filter((contact) => contact.name || contact.email || contact.phone || contact.role);

  if (normalized.length > 0) return normalized;
  if (client.contact_name || client.email || client.phone) {
    return [{
      name: client.contact_name ?? '',
      role: '',
      email: client.email ?? '',
      phone: client.phone ?? ''
    }];
  }
  return [];
}

export function primaryContact(client = {}) {
  return normalizeContacts(client)[0] ?? null;
}

export function normalizeSocialLinks(client = {}) {
  const links = Array.isArray(client.social_links) ? client.social_links : [];
  const normalized = links
    .map((item) => ({
      brand: item?.brand ?? '',
      platform: item?.platform ?? '',
      url: item?.url ?? ''
    }))
    .filter((item) => item.brand || item.platform || item.url);

  if (normalized.length > 0) return normalized;
  if (client.managed_brands) {
    return client.managed_brands
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((brand) => ({ brand, platform: '', url: '' }));
  }
  return [];
}
