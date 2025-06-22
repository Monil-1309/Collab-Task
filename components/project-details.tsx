"use client"

import { useState } from "react"
import { Users, BarChart3, Plus, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCard } from "@/components/task-card"
import { TaskModal } from "@/components/task-modal"
import { useTasks } from "@/hooks/use-tasks"
import type { Project } from "@/hooks/use-projects"
import { cn } from "@/lib/utils"

interface ProjectDetailsProps {
  project: Project
}

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "on-hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const { tasks, addTask } = useTasks()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("")

  // Get tasks for this project
  const projectTasks = tasks.filter((task) => task.projectId === project.id)

  // Filter tasks
  const filteredTasks = projectTasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter

    return matchesSearch && matchesStatus && matchesAssignee
  })

  // Calculate project statistics
  const completedTasks = projectTasks.filter((task) => task.status === "done" || task.status === "deployed").length
  const totalTasks = projectTasks.length
  const actualProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSaveTask = (taskData: any) => {
    addTask({ ...taskData, projectId: project.id })
  }

  // Group tasks by status
  const tasksByStatus = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    },
    {} as Record<string, typeof filteredTasks>,
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
      {/* Project Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <p className="text-muted-foreground mt-2">{project.description}</p>
              </div>
              <Badge className={cn("capitalize", statusColors[project.status])}>
                {project.status.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-medium">{formatDate(project.startDate)}</div>
              </div>
              {project.endDate && (
                <div>
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div className="font-medium">{formatDate(project.endDate)}</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{actualProgress}% complete</span>
              </div>
              <Progress value={actualProgress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.members.map((memberEmail) => (
                <div key={memberEmail} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberEmail}`} />
                    <AvatarFallback className="text-xs">{memberEmail.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{memberEmail.split("@")[0]}</div>
                    <div className="text-xs text-muted-foreground">{memberEmail}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Tasks
              <Badge variant="secondary">{filteredTasks.length}</Badge>
            </CardTitle>
            <Button onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {project.members.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member.split("@")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {projectTasks.length === 0 ? "No tasks in this project yet." : "No tasks match your filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {statusOrder.map((status) => {
                const statusTasks = tasksByStatus[status] || []
                if (statusTasks.length === 0) return null

                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {statusLabels[status as keyof typeof statusLabels]}
                      </h3>
                      <div className="h-px bg-border flex-1" />
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {statusTasks.length}
                      </span>
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
        </CardContent>
      </Card>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} />
    </div>
  )
}
