"use client";
import DottedSperator from "@/components/dotted-sperator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Loader2 } from "lucide-react";
import { useCreateTaskModel } from "../hooks/use-create-task-model";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../api/use-get-tasks";
import { DataFilters } from "./data-filters";
import { useQueryState } from "nuqs";
import { useTasksFilter } from "../hooks/use-tasks-filter";
import { Column } from "./column";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types/task-status";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import DataCalender from "./data-calender";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export function TaskViewSwitcher({ hideProjectFilter }: TaskViewSwitcherProps) {
  const { open: openTaskCreationModel } = useCreateTaskModel();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const [{ status, projectId, assigneeId, dueDate }] = useTasksFilter();

  const { data: tasks, isLoading } = useGetTasks({
    workspaceId,
    status,
    projectId: paramProjectId || projectId,
    assigneeId,
    dueDate: dueDate ? new Date(dueDate) : null,
  });

  const { mutate: bulkUpdate } = useBulkUpdateTask();

  const onKanbanChange = useCallback(
    (
      tasks: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[]
    ) => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  const [view, setView] = useQueryState<"table" | "kanban" | "calendar">(
    "task-view",
    {
      defaultValue: "table",
      parse: (value) => value as "table" | "kanban" | "calendar",
    }
  );

  return (
    <Tabs
      className="w-full flex-1 border rounded-lg"
      value={view}
      onValueChange={(value) =>
        setView(value as "table" | "kanban" | "calendar")
      }
    >
      <div className="flex flex-col h-full overflow-y-auto p-4">
        <div className="flex items-center justify-between flex-col gap-2 lg:flex-row lg:w-full">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size={"sm"}
            className="w-full lg:w-auto"
            onClick={() => openTaskCreationModel(null)}
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSperator className="py-7" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSperator className="py-7" />
        {isLoading ? (
          <div className="w-full border rounded-lg flex flex-col items-center justify-center h-52">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={Column} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                tasks={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalender tasks={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
