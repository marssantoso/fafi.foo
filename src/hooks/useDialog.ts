import { useState, useCallback } from 'react'

export const useDialog = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const openDialog = useCallback(() => setIsOpen(true), [])
  const closeDialog = useCallback(() => setIsOpen(false), [])
  const toggleDialog = useCallback(() => setIsOpen(!open), [open])

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
    setIsOpen,
  }
}
