import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type GetSingleTaskProps = {
  taskId: string;
};

export const useGetSingleTask = ({ taskId }: GetSingleTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: {
          taskId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      }

      return null;
    },
  });

  return query;
};
