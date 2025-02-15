import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types/task-status";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModel } from "../hooks/use-create-task-model";
interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-4 text-pink-400" />,
  [TaskStatus.TODO]: <CircleIcon className="size-4 text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4 text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size-4 text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-4 text-emerald-400" />,
};
export function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const { open } = useCreateTaskModel();

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {statusIconMap[board]}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 rounded-md text-xs bg-neutral-200 text-neutral-700 font-medium flex items-center justify-center">
          {taskCount}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => open(board)}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
}
