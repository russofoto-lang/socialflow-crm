export const statusOptions = [
  { value: 'ideas', label: 'Idee' },
  { value: 'todo', label: 'Da fare' },
  { value: 'in_progress', label: 'In lavorazione' },
  { value: 'to_approve', label: 'Da approvare' },
  { value: 'published', label: 'Pubblicato' }
];

export const contentTypeOptions = [
  { value: 'post', label: 'Post Instagram/Facebook' },
  { value: 'reel', label: 'Reel / video breve' },
  { value: 'stories', label: 'Stories' },
  { value: 'carousel', label: 'Carosello' }
];

export const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram_facebook', label: 'Instagram + Facebook' }
];

export const approvalOptions = [
  { value: 'not_required', label: 'Non richiesta' },
  { value: 'pending', label: 'In attesa' },
  { value: 'approved', label: 'Approvato dal cliente' },
  { value: 'changes_requested', label: 'Modifiche richieste' }
];

export const labelFor = (options, value) => options.find((option) => option.value === value)?.label;
