import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-sperator";
import { Task } from "../types/task";
import { OverviewProperty } from "./overview-property";
import { PencilIcon } from "lucide-react";
import { MembersAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModel } from "../hooks/use-update-task-model";
interface TaskOverviewProps {
  task: Task;
}

export function TaskOverview({ task }: TaskOverviewProps) {
  const { open } = useEditTaskModel();

  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button variant="outline" size="sm" onClick={() => open(task.$id)}>
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-4">
          <OverviewProperty label="Assignee">
            <MembersAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}
