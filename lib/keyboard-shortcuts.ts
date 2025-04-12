export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
}

export function setupKeyboardShortcuts(shortcuts: KeyboardShortcut[]): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return
    }

    const shortcut = shortcuts.find((s) => s.key === event.key)
    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }

  window.addEventListener("keydown", handleKeyDown)

  // Return cleanup function
  return () => {
    window.removeEventListener("keydown", handleKeyDown)
  }
}
