"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Create a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // State to store our value
  // Pass the initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  // Only run this effect on mount and when key changes
  useEffect(() => {
    if (!isFirstRender.current) {
      return // Skip effect on re-renders
    }

    isFirstRender.current = false // Mark first render as complete

    // This effect now only runs on mount
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error("Error parsing localStorage change:", error)
        }
      }
    }

    // Listen for changes to this localStorage key in other tabs/windows
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}
