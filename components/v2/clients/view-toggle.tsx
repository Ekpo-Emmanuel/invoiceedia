"use client"

import { LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ViewToggleProps {
  view: "table" | "list"
  onViewChange: (view: "table" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && onViewChange(value as "table" | "list")}>
      <ToggleGroupItem value="table" aria-label="Toggle table view">
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Toggle list view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
} 