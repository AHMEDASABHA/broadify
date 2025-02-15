import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types/task-status";
import type { Task } from "../types/task";
type GetTasksProps = {
  workspaceId: string;
  status?: TaskStatus | null;
  dueDate?: Date | null;
  projectId?: string | null;
  assigneeId?: string | null;
  search?: string | null;
};

export const useGetTasks = ({
  workspaceId,
  status,
  dueDate,
  projectId,
  assigneeId,
  search,
}: GetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate?.toISOString() ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      if (data.success) {
        return {
          total: data.data.length,
          documents: data.data as Task[],
        };
      }

      return {
        total: 0,
        documents: [],
      };
    },
  });

  return query;
};
