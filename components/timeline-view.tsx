"use client"

import { useState } from "react"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { TaskModal } from "@/components/task-modal"
import { useTasks, type Task } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  tasks: Task[]
  searchQuery: string
  filters: {
    status: string
    priority: string
    assignee: string
    type: string
  }
}

export function TimelineView({ tasks, searchQuery, filters }: TimelineViewProps) {
  const { addTask } = useTasks()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !filters.status || task.status === filters.status
      const matchesPriority = !filters.priority || task.priority === filters.priority
      const matchesAssignee = !filters.assignee || task.assignee === filters.assignee
      const matchesType = !filters.type || task.type === filters.type

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesType
    })
  }

  const filteredTasks = filterTasks(tasks)

  // Group tasks by date (created date and due date)
  const timelineEvents = []

  filteredTasks.forEach((task) => {
    // Add creation event
    timelineEvents.push({
      id: `created-${task.id}`,
      date: task.createdAt,
      type: "created" as const,
      task,
    })

    // Add due date event if exists
    if (task.dueDate) {
      timelineEvents.push({
        id: `due-${task.id}`,
        date: task.dueDate,
        type: "due" as const,
        task,
      })
    }
  })

  // Sort events by date (newest first)
  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group events by date
  const groupedEvents = timelineEvents.reduce(
    (acc, event) => {
      const dateKey = new Date(event.date).toDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(event)
      return acc
    },
    {} as Record<string, typeof timelineEvents>,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Timeline View</h2>
          <p className="text-sm text-muted-foreground">Task activity and due dates timeline</p>
        </div>
        <Button onClick={() => setIsTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No timeline events found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([dateKey, events]) => (
            <div key={dateKey} className="relative">
              {/* Date header */}
              <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-sm border rounded-lg p-3 mb-4">
                <h3 className="font-semibold text-lg">{formatDate(dateKey)}</h3>
              </div>

              {/* Timeline events */}
              <div className="space-y-4 pl-6 border-l-2 border-muted relative">
                {events.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background",
                        event.type === "created" ? "bg-blue-500" : "bg-orange-500",
                      )}
                    />

                    <Card className="ml-4">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {event.type === "created" ? (
                                <Plus className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Calendar className="h-4 w-4 text-orange-500" />
                              )}
                              <span className="text-sm font-medium">
                                {event.type === "created" ? "Task Created" : "Due Date"}
                              </span>
                              <span className="text-xs text-muted-foreground">{formatTime(event.date)}</span>
                            </div>

                            <h4 className="font-medium">{event.task.title}</h4>

                            {event.task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{event.task.description}</p>
                            )}

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className={cn("text-xs", statusColors[event.task.status])}>
                                {event.task.status.replace("-", " ")}
                              </Badge>
                              <Badge variant="secondary" className={cn("text-xs", priorityColors[event.task.priority])}>
                                {event.task.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {event.task.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {event.task.assignee && (
                              <div className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.task.assignee}`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {event.task.assignee.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {event.task.assignee.split("@")[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={addTask} />
    </div>
  )
}
