"use client"

import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  onDelete: () => void
  onRestore: () => void
}

export function BulkActions({ selectedCount, onDelete, onRestore }: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-muted/50 border rounded-md p-2 mb-4 flex items-center justify-between">
      <div className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? "user" : "users"} selected
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRestore} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Restore
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete} className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
