import { Task } from "@/features/tasks/types/task";
import { TaskActions } from "./task-actions";
import { MoreHorizontal } from "lucide-react";
import DottedSeparator from "@/components/dotted-sperator";
import { MembersAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="rounded bg-white p-2.5 shadow-sm space-y-3 mt-2">
      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.project.$id}>
          <MoreHorizontal className="size-4 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition duration-200" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-1.5">
        <MembersAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-1.5">
        <ProjectAvatar
          name={task.project.name}
          imageUrl={task.project.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
}
