import type { Project } from "@/features/projects/types/project";
import type { Task } from "../types/task";
import Link from "next/link";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../api/use-delete-task";
import { useRouter } from "next/navigation";
interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this task?",
    "This action cannot be undone.",
    "destructive"
  );

  function handleDeleteTask() {
    const confirmed = confirm();
    if (!confirmed) return;
    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  }

  return (
    <div className="flex items-center gap-2">
      <ConfirmDialog />

      <ProjectAvatar
        name={project.name}
        imageUrl={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto"
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">
          {isPending ? "Deleting..." : "Delete task"}
        </span>
      </Button>
    </div>
  );
}
