export interface TextSegment {
  readonly text: string
  readonly highlighted: boolean
}

/**
 * Split a sentence around a phrase so the UI can emphasise it without the
 * sentence being written twice — once as data and once as JSX with a `<span>`
 * in the middle. Pure and case-sensitive; an absent phrase yields one segment.
 */
export const splitHighlight = (text: string, phrase: string): readonly TextSegment[] => {
  if (!phrase) return [{ text, highlighted: false }]

  const start = text.indexOf(phrase)
  if (start === -1) return [{ text, highlighted: false }]

  const segments: TextSegment[] = []
  if (start > 0) segments.push({ text: text.slice(0, start), highlighted: false })
  segments.push({ text: phrase, highlighted: true })

  const rest = text.slice(start + phrase.length)
  if (rest) segments.push({ text: rest, highlighted: false })

  return segments
}
