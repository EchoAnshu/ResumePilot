import { useEffect } from 'react'

export function useShortcuts(handlers: Record<string, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = [
        e.ctrlKey || e.metaKey ? 'Ctrl' : '',
        e.shiftKey ? 'Shift' : '',
        e.key === ' ' ? 'Space' : e.key,
      ]
        .filter(Boolean)
        .join('+')

      if (handlers[key]) {
        handlers[key](e)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handlers])
}

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  enabled = true,
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!enabled) return
      const key = [
        e.ctrlKey || e.metaKey ? 'Ctrl' : '',
        e.shiftKey ? 'Shift' : '',
        e.key === ' ' ? 'Space' : e.key,
      ]
        .filter(Boolean)
        .join('+')

      if (keys.includes(key)) {
        e.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [keys, callback, enabled])
}
