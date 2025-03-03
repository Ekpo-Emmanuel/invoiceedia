"use client"

import { useState, useEffect } from "react"
import { Monitor, Moon, Sun } from 'lucide-react'

type Theme = "dark" | "light" | "system"

export default function ModeToggle() {
  const [theme, setTheme] = useState<Theme>("system")
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      updateTheme(savedTheme)
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("light", "dark")

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.add(systemTheme)
    } else {
      document.documentElement.classList.add(newTheme)
    }

    localStorage.setItem("theme", newTheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    updateTheme(newTheme)
  }

  return (
    <div className="relative flex p-1 bg-muted rounded-full">  
    {[
      { icon: Moon, value: "dark" },
      { icon: Sun, value: "light" },
      // { icon: Monitor, value: "system" }
    ].map(({ icon: Icon, value }) => (
      <button
        key={value}
        onClick={() => handleThemeChange(value as Theme)}
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 ${
          theme === value 
            ? "bg-muted" 
            : "text-primary/40"
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="sr-only">
          {value.charAt(0).toUpperCase() + value.slice(1)} mode
        </span>
      </button>
    ))}
  </div>
  )
}

