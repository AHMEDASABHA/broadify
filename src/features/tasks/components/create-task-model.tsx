"use client";
import { ResponsiveModel } from "@/components/dashboard/responsive-model";
import { useCreateTaskModel } from "../hooks/use-create-task-model";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import type { TaskStatus } from "../types/task-status";
export function CreateTaskModel() {
  const { isOpen, setIsOpen, close, board } = useCreateTaskModel();

  return (
    <ResponsiveModel
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Task"
      description="Create a new task to start managing your projects"
    >
      <CreateTaskFormWrapper onCancel={close} board={board as TaskStatus} />
    </ResponsiveModel>
  );
}
