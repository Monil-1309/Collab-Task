"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BoardView } from "@/components/board-view";
import { ListView } from "@/components/list-view";
import { CalendarView } from "@/components/calendar-view";
import { TableView } from "@/components/table-view";
import { TimelineView } from "@/components/timeline-view";
import { SearchAndFilter } from "@/components/search-and-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskModal } from "@/components/task-modal";
import type { Task } from "@/hooks/use-tasks";

export type ViewMode = "board" | "list" | "calendar" | "table" | "timeline";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("board");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
    type: "",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (data.success) {
          // Ensure each task has a unique id
          const tasksWithId = data.data.map((task: any, idx: number) => ({
            ...task,
            id: task.id || task._id || crypto.randomUUID() || idx.toString(),
          }));
          setTasks(tasksWithId);
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (task: Task) => {
    console.log("before try Adding task:", task);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task), // ✅ sending single task
      });
      const data = await res.json();
      console.log("after json Response from addTask:", data);
      if (data.success) setTasks((prev) => [...prev, data.data]);
      console.log("Task added successfully:", data.data);
    } catch (e) {
      console.error("Error adding task:", e);
    }
  };
  

  const renderView = () => {
    const viewProps = {
      tasks,
      searchQuery,
      filters,
    };

    switch (currentView) {
      case "board":
        return <BoardView {...viewProps} addTask={addTask} />;
      case "list":
        return <ListView {...viewProps} />;
      case "calendar":
        return <CalendarView {...viewProps} />;
      case "table":
        return <TableView {...viewProps} />;
      case "timeline":
        return <TimelineView {...viewProps} />;
      default:
        return <BoardView {...viewProps} addTask={addTask} />;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your tasks and projects efficiently
              </p>
            </div>
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className="min-h-[600px]">
            {loading ? <div>Loading tasks...</div> : renderView()}
          </div>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={addTask}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
