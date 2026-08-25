import { useCallback, useEffect, useRef, useState } from 'react'

const FEEDBACK_MS = 1800

export interface ClipboardState {
  readonly copied: boolean
  readonly failed: boolean
  readonly copy: (text: string) => Promise<void>
}

/**
 * Copy text and expose transient feedback.
 *
 * The failure branch matters: the Clipboard API is unavailable over plain HTTP
 * and in some embedded browsers, and a button that silently does nothing is
 * worse than one that admits it, so callers can fall back to a mailto link.
 */
export const useCopyToClipboard = (): ClipboardState => {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async (text: string) => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setFailed(false)
    } catch {
      setCopied(false)
      setFailed(true)
    }
    timer.current = setTimeout(() => {
      setCopied(false)
      setFailed(false)
    }, FEEDBACK_MS)
  }, [])

  return { copied, failed, copy }
}
