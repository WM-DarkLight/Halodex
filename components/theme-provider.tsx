"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
}

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: "system",
  setTheme: () => null,
})

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Don't set any default theme here to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    // Skip the first render to avoid hydration mismatch
    if (theme === "system") return

    // Save theme to localStorage
    localStorage.setItem("theme", theme)

    // Apply theme class
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return <ThemeProviderContext.Provider value={{ theme, setTheme }}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
