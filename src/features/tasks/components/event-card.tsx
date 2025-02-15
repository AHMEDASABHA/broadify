import { cn } from "@/lib/utils";
import { TaskStatus } from "../types/task-status";
import type { Project } from "@/features/projects/types/project";
import { MembersAvatar } from "@/features/members/components/member-avatar";
import type { Member } from "@/features/members/types/member";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
interface EventCardProps {
  title: string;
  assignee: Member;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-s-pink-500",
  [TaskStatus.TODO]: "border-s-red-500",
  [TaskStatus.IN_PROGRESS]: "border-s-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-s-blue-500",
  [TaskStatus.DONE]: "border-s-emerald-500",
};

export const EventCard: React.FC<EventCardProps> = ({
  title,
  assignee,
  project,
  status,
  id,
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }
  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p className="font-medium">{title}</p>
        <div className="flex items-center gap-1">
          <MembersAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project.name} imageUrl={project.imageUrl} />
        </div>
      </div>
    </div>
  );
};
