"use client"

import { useRouter } from "next/navigation"
import { Calendar, Flag, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { Task } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

const typeColors = {
  bug: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  feature: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  improvement: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter()

  const completedSubtasks = task?.subtasks?.filter((st) => st.completed).length
  const totalSubtasks = task?.subtasks?.length
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  const handleClick = () => {
    router.push(`/tasks/${task.id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
          <Badge variant="secondary" className={cn("text-xs", priorityColors[task.priority])}>
            <Flag className="w-3 h-3 mr-1" />
            {task?.priority}
          </Badge>
        </div>

        {/* Description */}
        {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

        {/* Labels */}
        {task?.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {label}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Type badge */}
        <Badge variant="secondary" className={cn("text-xs w-fit", typeColors[task.type])}>
          {task.type}
        </Badge>

        {/* Progress */}
        {totalSubtasks > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Subtasks</span>
              <span className="text-muted-foreground">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} />
                  <AvatarFallback className="text-xs">{task.assignee.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            )}

            {task?.comments?.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {task.comments.length} comment{task.comments.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
              )}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
