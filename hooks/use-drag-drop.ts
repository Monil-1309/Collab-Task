"use client"

import type React from "react"

import { useState } from "react"

export function useDragDrop() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, onDrop: (draggedId: string) => void) => {
    e.preventDefault()
    if (draggedItem) {
      onDrop(draggedItem)
    }
    setDraggedItem(null)
  }

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  }
}
