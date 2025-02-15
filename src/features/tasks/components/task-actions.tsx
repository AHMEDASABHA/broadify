"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModel } from "../hooks/use-update-task-model";
interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { open } = useEditTaskModel();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this task?",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate: deleteTask, isPending } = useDeleteTask();

  async function handleDeleteTask() {
    const confirmed = await confirm();
    if (!confirmed) return;
    deleteTask({ param: { taskId: id } });
  }

  async function onOpenProject() {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  async function onOpenTaskDetails() {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  return (
    <div className="flex justify-end">
      {<ConfirmationDialog />}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="font-medium p-2.5"
            onClick={onOpenProject}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-2.5"
            onClick={onOpenTaskDetails}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-2.5"
            onClick={() => open(id)}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-2.5"
            disabled={isPending}
            onClick={handleDeleteTask}
          >
            <TrashIcon className="text-amber-700 focus:text-amber-800 size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
