"use client";

import { useGetSingleTask } from "@/features/tasks/api/use-get-single-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { PageLoader } from "@/components/page-loader";
import {PageError} from "@/components/page-error";
import DottedSeparator from "@/components/dotted-sperator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import TaskDescription from "@/features/tasks/components/task-description";
export function SingleTaskPageClient({ taskId }: { taskId: string }) {
  const { data: task, isLoading } = useGetSingleTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!task) {
    return <PageError errorMessage="Task not found" />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
}
