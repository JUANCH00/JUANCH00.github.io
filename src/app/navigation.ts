/**
 * The page's section map, declared once.
 *
 * The nav bar renders from this list and each section takes its `id` from it,
 * which makes a broken anchor a type error rather than a link that silently
 * scrolls nowhere.
 */
export const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'lab', label: 'Lab' },
  { id: 'stack', label: 'Stack' },
  { id: 'notes', label: 'Notes' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const MAIN_CONTENT_ID = 'top'
