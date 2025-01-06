"use client"

import { LayoutGrid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ViewToggleProps {
  view: "table" | "list"
  onViewChange: (view: "table" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup 
        type="single" 
        value={view} onValueChange={(value) => value && onViewChange(value as "table" | "list")}
        className="bg-white dark:bg-muted/20 border p-1 rounded"
    >
      <ToggleGroupItem value="table" aria-label="Toggle table view" className="p-0">
        <List className="h-3 w-3" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Toggle list view" className="p-0">
        <LayoutGrid className="h-3 w-3" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
} 