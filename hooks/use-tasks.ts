"use client";

import { useLocalStorage } from "./use-local-storage";

export interface Task {
  id: string;
  title: string;
  description: string;
  status:
    | "backlog"
    | "todo"
    | "in-progress"
    | "on-hold"
    | "done"
    | "deployed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  type: "bug" | "feature" | "improvement";
  assignee?: string;
  dueDate?: string;
  labels: string[];
  projectId?: string;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new dashboard layout",
    description:
      "Create a modern and intuitive dashboard layout for better user experience",
    status: "in-progress",
    priority: "high",
    type: "feature",
    assignee: "john@example.com",
    dueDate: "2024-01-15",
    labels: ["design", "ui/ux"],
    subtasks: [
      {
        id: "s1",
        title: "Create wireframes",
        completed: true,
        createdAt: "2024-01-01",
      },
      {
        id: "s2",
        title: "Design mockups",
        completed: false,
        createdAt: "2024-01-02",
      },
    ],
    comments: [
      {
        id: "c1",
        text: "Looking great so far!",
        author: "jane@example.com",
        createdAt: "2024-01-03",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-03",
  },
  {
    id: "2",
    title: "Fix login authentication bug",
    description: "Users are experiencing issues with login authentication",
    status: "todo",
    priority: "urgent",
    type: "bug",
    assignee: "jane@example.com",
    dueDate: "2024-01-10",
    labels: ["bug", "authentication"],
    subtasks: [],
    comments: [],
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", initialTasks);

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    console.log("tasks", tasks, newTask);
    return newTask;
  };
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    updateTask(taskId, { status: newStatus });
  };

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      updateTask(taskId, {
        subtasks: [...task.subtasks, newSubtask],
      });
    }
  };

  const updateSubtask = (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.filter(
        (subtask) => subtask.id !== subtaskId
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  const addComment = (taskId: string, text: string, author: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      updateTask(taskId, {
        comments: [...task.comments, newComment],
      });
    }
  };

  const deleteComment = (taskId: string, commentId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedComments = task.comments.filter(
        (comment) => comment.id !== commentId
      );
      updateTask(taskId, { comments: updatedComments });
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addComment,
    deleteComment,
  };
}
