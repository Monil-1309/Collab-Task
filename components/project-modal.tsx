"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import type { Project } from "@/hooks/use-projects"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  project?: Project
}

export function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const { users } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as Project["status"],
    members: [] as string[],
    progress: 0,
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        members: project.members,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        members: [],
        progress: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      })
    }
  }, [project, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    onSave({
      ...formData,
      endDate: formData.endDate || undefined,
    })
    onClose()
  }

  const addMember = (memberEmail: string) => {
    if (!formData.members.includes(memberEmail)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, memberEmail],
      }))
    }
  }

  const removeMember = (memberEmail: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== memberEmail),
    }))
  }

  const availableUsers = users.filter((user) => !formData.members.includes(user.email))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          {/* Status and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Project["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData((prev) => ({ ...prev, progress: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Members */}
          <div className="space-y-2">
            <Label>Team Members</Label>

            {/* Current members */}
            {formData.members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.members.map((memberEmail) => {
                  const user = users.find((u) => u.email === memberEmail)
                  return (
                    <Badge key={memberEmail} variant="secondary" className="gap-1">
                      {user?.name || memberEmail}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMember(memberEmail)} />
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Add member */}
            {availableUsers.length > 0 && (
              <Select onValueChange={addMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Add team member" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{project ? "Update Project" : "Create Project"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
