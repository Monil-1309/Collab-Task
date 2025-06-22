"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsView } from "@/components/reports-view"

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analyze your team's productivity and progress</p>
          </div>

          <ReportsView />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
