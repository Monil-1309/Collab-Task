"use client"

import { useState } from "react"
import { Calendar, User, Flag, Tag, Plus, X, Edit2, Trash2, MessageSquare, CheckSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks, type Task } from "@/hooks/use-tasks"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface TaskDetailsProps {
  task: Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { updateTask, addSubtask, updateSubtask, deleteSubtask, addComment, deleteComment } = useTasks()
  const { user, users } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(task)
  const [newSubtask, setNewSubtask] = useState("")
  const [newComment, setNewComment] = useState("")
  const [newLabel, setNewLabel] = useState("")

  const handleSave = () => {
    updateTask(task.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(task)
    setIsEditing(false)
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(task.id, newSubtask.trim())
      setNewSubtask("")
    }
  }

  const handleAddComment = () => {
    if (newComment.trim() && user) {
      addComment(task.id, newComment.trim(), user.email)
      setNewComment("")
    }
  }

  const handleAddLabel = () => {
    if (newLabel.trim() && !editData.labels.includes(newLabel.trim())) {
      setEditData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }))
      setNewLabel("")
    }
  }

  const removeLabel = (label: string) => {
    setEditData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== label),
    }))
  }

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length
  const totalSubtasks = task.subtasks.length
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  const statusColors = {
    backlog: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    todo: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    "on-hold": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    done: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    deployed: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold border-none p-0 h-auto"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <Label className="text-sm font-medium">Description</Label>
              {isEditing ? (
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{task.description || "No description provided."}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.status}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, status: value as Task["status"] }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge className={cn("capitalize", statusColors[task.status])}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                {isEditing ? (
                  <Select
                    value={editData.priority}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, priority: value as Task["priority"] }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge className={cn("capitalize", priorityColors[task.priority])}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Labels */}
            <div>
              <Label className="text-sm font-medium">Labels</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editData.labels : task.labels).map((label) => (
                    <Badge key={label} variant="secondary" className="gap-1">
                      <Tag className="w-3 h-3" />
                      {label}
                      {isEditing && <X className="h-3 w-3 cursor-pointer" onClick={() => removeLabel(label)} />}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Add a label"
                      onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddLabel} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Subtasks
              {totalSubtasks > 0 && (
                <Badge variant="secondary">
                  {completedSubtasks}/{totalSubtasks}
                </Badge>
              )}
            </CardTitle>
            {totalSubtasks > 0 && <Progress value={progress} className="h-2" />}
          </CardHeader>
          <CardContent className="space-y-4">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-3 p-2 rounded border">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={(checked) => updateSubtask(task.id, subtask.id, { completed: checked as boolean })}
                />
                <span className={cn("flex-1", subtask.completed && "line-through text-muted-foreground")}>
                  {subtask.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSubtask(task.id, subtask.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask"
                onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                className="flex-1"
              />
              <Button onClick={handleAddSubtask} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
              <Badge variant="secondary">{task.comments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} />
                  <AvatarFallback className="text-xs">{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author.split("@")[0]}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteComment(task.id, comment.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleAddComment} size="sm" className="self-end">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Task Info */}
        <Card>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignee
              </Label>
              {isEditing ? (
                <Select
                  value={editData.assignee}
                  onValueChange={(value) => setEditData((prev) => ({ ...prev, assignee: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} />
                        <AvatarFallback className="text-xs">{task.assignee.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <div className="mt-1">
                  {task.dueDate ? (
                    <span
                      className={cn(
                        "text-sm",
                        new Date(task.dueDate) < new Date() && task.status !== "done" && task.status !== "deployed"
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No due date</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Created
              </Label>
              <div className="mt-1">
                <span className="text-sm text-muted-foreground">{formatDate(task.createdAt)}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Updated
              </Label>
              <div className="mt-1">
                <span className="text-sm text-muted-foreground">{formatDate(task.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments (Simulated) */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">No attachments</p>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
