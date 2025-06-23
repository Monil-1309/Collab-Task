"use client";

import { useTasks, type Task } from "@/hooks/use-tasks";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskModal } from "@/components/task-modal";
import { cn } from "@/lib/utils";

interface BoardViewProps {
  tasks: Task[];
  searchQuery: string;
  filters: {
    status: string;
    priority: string;
    assignee: string;
    type: string;
  };
}

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "todo", title: "To Do", color: "bg-blue-100 dark:bg-blue-900/20" },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    id: "on-hold",
    title: "On Hold",
    color: "bg-orange-100 dark:bg-orange-900/20",
  },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
  {
    id: "deployed",
    title: "Deployed",
    color: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    id: "cancelled",
    title: "Cancelled",
    color: "bg-red-100 dark:bg-red-900/20",
  },
] as const;

export function BoardView({ tasks, searchQuery, filters }: BoardViewProps) {
  console.log("tasks", tasks);
  const { moveTask, addTask } = useTasks();
  const {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDragDrop();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] =
    useState<Task["status"]>("backlog");

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;
      const matchesAssignee =
        !filters.assignee || task.assignee === filters.assignee;
      const matchesType = !filters.type || task.type === filters.type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesType
      );
    });
  };

  const filteredTasks = filterTasks(tasks);

  const getTasksForColumn = (columnId: string) => {
    return filteredTasks.filter((task) => task.status === columnId);
  };

  const handleTaskDrop = (columnId: string, taskId: string) => {
    moveTask(taskId, columnId as Task["status"]);
  };

  const handleAddTask = (columnId: Task["status"]) => {
    setSelectedColumn(columnId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    addTask({ ...taskData, status: selectedColumn });
  };

  return (
    <div className="h-full">
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnTasks = getTasksForColumn(column.id);

          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 w-80 rounded-lg border p-4",
                column.color
              )}
              onDragOver={handleDragOver}
              onDrop={(e) =>
                handleDrop(e, (taskId) => handleTaskDrop(column.id, taskId))
              }
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddTask(column.id as Task["status"])}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id || task._id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "cursor-move transition-opacity",
                      draggedItem === task.id && "opacity-50"
                    )}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No tasks in this column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        defaultStatus={selectedColumn}
      />
    </div>
  );
}
