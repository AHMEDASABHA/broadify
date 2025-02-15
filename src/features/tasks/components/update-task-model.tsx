"use client";
import { ResponsiveModel } from "@/components/dashboard/responsive-model";
import { useEditTaskModel } from "../hooks/use-update-task-model";
import { UpdateTaskFormWrapper } from "./update-task-form-wrapper";

export function EditTaskModel() {
  const { taskId, close } = useEditTaskModel();

  return (
    <ResponsiveModel
      open={!!taskId}
      onOpenChange={close}
      title="Edit Task"
      description="Edit the task details"
    >
      {taskId && <UpdateTaskFormWrapper onCancel={close} taskId={taskId} />}
    </ResponsiveModel>
  );
}
