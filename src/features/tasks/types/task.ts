import type { Models } from "node-appwrite";
import type { TaskStatus } from "./task-status";
import type { Project } from "@/features/projects/types/project";
export type Task = Models.Document & {
  name: string;
  workspaceId: string;
  assigneeId: string;
  projectId: string;
  project: Project;
  position: number;
  dueDate: string;
  status: TaskStatus;
  description?: string;
};
