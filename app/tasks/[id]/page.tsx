"use client"

import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskDetails } from "@/components/task-details"
import { useTasks } from "@/hooks/use-tasks"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { tasks } = useTasks()

  const taskId = params.id as string
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <h1 className="text-2xl font-bold">Task Not Found</h1>
            <p className="text-muted-foreground">The task you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Task Details</h1>
          </div>

          <TaskDetails task={task} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
