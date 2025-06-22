"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskModal } from "@/components/task-modal"
import { useTasks, type Task } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  tasks: Task[]
  searchQuery: string
  filters: {
    status: string
    priority: string
    assignee: string
    type: string
  }
}

export function CalendarView({ tasks, searchQuery, filters }: CalendarViewProps) {
  const { addTask } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return filteredTasks.filter((task) => task.dueDate === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    setSelectedDate(dateString)
    setIsTaskModalOpen(true)
  }

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    addTask({ ...taskData, dueDate: selectedDate })
  }

  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{monthYear}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={() => setIsTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-32 border-r border-b" />
            }

            const dayTasks = getTasksForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "h-32 border-r border-b p-2 cursor-pointer hover:bg-muted/50 transition-colors",
                  !isCurrentMonth && "text-muted-foreground bg-muted/20",
                )}
                onClick={() => handleDateClick(date)}
              >
                <div className={cn("text-sm font-medium mb-1", isToday && "text-primary font-bold")}>
                  {date.getDate()}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="text-xs p-1 rounded truncate bg-background border" title={task.title}>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityColors[task.priority])} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    </div>
                  ))}

                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">Priority:</span>
        {Object.entries(priorityColors).map(([priority, color]) => (
          <div key={priority} className="flex items-center gap-1">
            <div className={cn("w-3 h-3 rounded-full", color)} />
            <span className="capitalize">{priority}</span>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        defaultStatus="todo"
      />
    </div>
  )
}
