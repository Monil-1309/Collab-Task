"use client"

import { useState } from "react"
import { Calendar, Download, BarChart3, PieChart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function ReportsView() {
  const { tasks } = useTasks()
  const { projects } = useProjects()
  const { users } = useAuth()
  const { toast } = useToast()

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    projectId: "",
    assignee: "",
    taskType: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt)
    const startDate = filters.startDate ? new Date(filters.startDate) : null
    const endDate = filters.endDate ? new Date(filters.endDate) : null

    const matchesDateRange = (!startDate || taskDate >= startDate) && (!endDate || taskDate <= endDate)
    const matchesProject = !filters.projectId || task.projectId === filters.projectId
    const matchesAssignee = !filters.assignee || task.assignee === filters.assignee
    const matchesType = !filters.taskType || task.type === filters.taskType

    return matchesDateRange && matchesProject && matchesAssignee && matchesType
  })

  // Calculate statistics
  const tasksByStatus = filteredTasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByPriority = filteredTasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByType = filteredTasks.reduce(
    (acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByAssignee = filteredTasks.reduce(
    (acc, task) => {
      const assignee = task.assignee || "Unassigned"
      acc[assignee] = (acc[assignee] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate completion rate
  const completedTasks = filteredTasks.filter((task) => task.status === "done" || task.status === "deployed").length
  const completionRate = filteredTasks.length > 0 ? Math.round((completedTasks / filteredTasks.length) * 100) : 0

  // Calculate overdue tasks
  const overdueTasks = filteredTasks.filter(
    (task) =>
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && task.status !== "deployed",
  ).length

  const handleExport = (format: "pdf" | "csv") => {
    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Export Successful",
        description: `Report exported as ${format.toUpperCase()} successfully!`,
      })
    }, 2000)
  }

  const statusColors = {
    backlog: "#6b7280",
    todo: "#3b82f6",
    "in-progress": "#f59e0b",
    "on-hold": "#f97316",
    done: "#10b981",
    deployed: "#8b5cf6",
    cancelled: "#ef4444",
  }

  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    urgent: "#ef4444",
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={filters.projectId}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={filters.assignee}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, assignee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select
                value={filters.taskType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, taskType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTasks.length !== tasks.length && `of ${tasks.length} total`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTasks.length > 0 && `${Math.round((overdueTasks / filteredTasks.length) * 100)}% of total`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">of {projects.length} total projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByStatus).map(([status, count]) => {
                const percentage = Math.round((count / filteredTasks.length) * 100)
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                        />
                        <span className="capitalize">{status.replace("-", " ")}</span>
                      </div>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Task Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByPriority).map(([priority, count]) => {
                const percentage = Math.round((count / filteredTasks.length) * 100)
                return (
                  <div key={priority} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: priorityColors[priority as keyof typeof priorityColors] }}
                        />
                        <span className="capitalize">{priority}</span>
                      </div>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Task Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByType).map(([type, count]) => {
                const percentage = Math.round((count / filteredTasks.length) * 100)
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {type}
                      </Badge>
                    </div>
                    <span className="font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Assignee */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByAssignee).map(([assignee, count]) => {
                const percentage = Math.round((count / filteredTasks.length) * 100)
                const displayName = assignee === "Unassigned" ? assignee : assignee.split("@")[0]
                return (
                  <div key={assignee} className="flex items-center justify-between">
                    <span className="text-sm">{displayName}</span>
                    <span className="font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => handleExport("pdf")} disabled={isLoading} variant="outline">
              {isLoading ? "Exporting..." : "Export as PDF"}
            </Button>
            <Button onClick={() => handleExport("csv")} disabled={isLoading} variant="outline">
              {isLoading ? "Exporting..." : "Export as CSV"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Export functionality is simulated in this demo.</p>
        </CardContent>
      </Card>
    </div>
  )
}
