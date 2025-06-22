"use client"

import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskModal } from "@/components/task-modal"
import { useTasks, type Task } from "@/hooks/use-tasks"

interface ListViewProps {
  tasks: Task[]
  searchQuery: string
  filters: {
    status: string
    priority: string
    assignee: string
    type: string
  }
}

export function ListView({ tasks, searchQuery, filters }: ListViewProps) {
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

  // Group tasks by status
  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const statusOrder = ["backlog", "todo", "in-progress", "on-hold", "done", "deployed", "cancelled"]
  const statusLabels = {
    backlog: "Backlog",
    todo: "To Do",
    "in-progress": "In Progress",
    "on-hold": "On Hold",
    done: "Done",
    deployed: "Deployed",
    cancelled: "Cancelled",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">All Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => setIsTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {statusOrder.map((status) => {
            const statusTasks = groupedTasks[status] || []
            if (statusTasks.length === 0) return null

            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h3>
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{statusTasks.length}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {statusTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={addTask} />
    </div>
  )
}
