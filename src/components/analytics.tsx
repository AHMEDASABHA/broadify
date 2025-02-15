import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ProjectAnalyticsResponseType } from "../features/projects/api/use-get-project-analytics";
import { AnalyticsCard } from "./analytics-card";
import DottedSeparator from "./dotted-sperator";
interface AnalyticsProps {
  data?: ProjectAnalyticsResponseType;
}

export function Analytics({ data }: AnalyticsProps) {
  if (!data) {
    return null;
  }

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="flex w-full flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? "up" : "down"}
            increaseValue={data.taskDiff}
          />
          <DottedSeparator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assigneeTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.assigneeTaskDiff}
          />
          <DottedSeparator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDiff}
          />
          <DottedSeparator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="In Completed Tasks"
            value={data.inCompletedTaskCount}
            variant={data.inCompletedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.inCompletedTaskDiff}
          />
          <DottedSeparator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overDueTaskCount}
            variant={data.overDueTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.overDueTaskDiff}
          />
          <DottedSeparator orientation="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
