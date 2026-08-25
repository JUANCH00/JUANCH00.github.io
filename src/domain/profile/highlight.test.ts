import { describe, expect, it } from 'vitest'
import { splitHighlight } from './highlight'

describe('splitHighlight', () => {
  it('splits a sentence around the phrase', () => {
    expect(splitHighlight('I am an AI Trainer today', 'AI Trainer')).toEqual([
      { text: 'I am an ', highlighted: false },
      { text: 'AI Trainer', highlighted: true },
      { text: ' today', highlighted: false },
    ])
  })

  it('omits empty leading and trailing segments', () => {
    expect(splitHighlight('AI Trainer', 'AI Trainer')).toEqual([
      { text: 'AI Trainer', highlighted: true },
    ])
  })

  it('returns the text untouched when the phrase is absent or empty', () => {
    expect(splitHighlight('nothing to see', 'missing')).toEqual([
      { text: 'nothing to see', highlighted: false },
    ])
    expect(splitHighlight('nothing to see', '')).toEqual([
      { text: 'nothing to see', highlighted: false },
    ])
  })

  it('rebuilds the original text from its segments', () => {
    const text = 'Systems Engineering student and AI Trainer at Outlier.'
    const rebuilt = splitHighlight(text, 'AI Trainer at Outlier')
      .map((segment) => segment.text)
      .join('')
    expect(rebuilt).toBe(text)
  })
})
