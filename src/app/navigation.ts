/**
 * The page's section map, declared once.
 *
 * The nav bar renders from this list and each section takes its `id` from it,
 * which makes a broken anchor a type error rather than a link that silently
 * scrolls nowhere.
 */
export const SECTIONS = [
  // The id stays `work` so existing links to /#work keep landing.
  { id: 'work', label: 'Projects' },
  // The Lab proves what the projects claim, so it comes straight after them.
  { id: 'lab', label: 'Lab' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'notes', label: 'Notes' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** Stable for the life of the page, so observers keyed on it are built once. */
export const SECTION_IDS: readonly SectionId[] = SECTIONS.map((section) => section.id)

export const MAIN_CONTENT_ID = 'top'
