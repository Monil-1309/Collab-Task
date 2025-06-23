import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: [
      "backlog",
      "todo",
      "in-progress",
      "on-hold",
      "done",
      "deployed",
      "cancelled",
    ],
    default: "backlog",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  type: {
    type: String,
    enum: ["bug", "feature", "improvement"],
    default: "feature",
  },
  assignee: { type: String, default: "" },
  dueDate: { type: String, default: "" },
  labels: [String],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  subtasks: [
    {
      title: String,
      completed: { type: Boolean, default: false },
    },
  ],
  comments: [
    {
      author: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["planning", "active", "on-hold", "completed", "cancelled"],
    default: "planning",
  },
  members: [String],
  progress: { type: Number, default: 0 },
  startDate: { type: String, required: true },
  endDate: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
