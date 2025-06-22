"use client"

import { useRouter } from "next/navigation"
import { Calendar, Users, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProjects, type Project } from "@/hooks/use-projects"
import { cn } from "@/lib/utils"

interface ProjectGridProps {
  projects: Project[]
}

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "on-hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const { deleteProject } = useProjects()
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleProjectClick(project.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProjectClick(project.id)
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="text-red-600"
                  >
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status and Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={cn("capitalize", statusColors[project.status])}>
                  {project.status.replace("-", " ")}
                </Badge>
                <span className="text-sm text-muted-foreground">{project.progress}% complete</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            {/* Members */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, index) => (
                  <Avatar key={member} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} />
                    <AvatarFallback className="text-xs">{member.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{project.members.length - 3}</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {project.members.length} member{project.members.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Started {formatDate(project.startDate)}</span>
              </div>
              {project.endDate && <span>Due {formatDate(project.endDate)}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
