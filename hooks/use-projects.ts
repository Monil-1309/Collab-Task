"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  members: string[]
  progress: number
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX",
    status: "active",
    members: ["john@example.com", "jane@example.com"],
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-03-01",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-03",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop a mobile application for iOS and Android platforms",
    status: "planning",
    members: ["jane@example.com"],
    progress: 15,
    startDate: "2024-02-01",
    endDate: "2024-06-01",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
]

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", initialProjects)

  const addProject = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProjects([...projects, newProject])
    return newProject
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project,
      ),
    )
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  }
}
