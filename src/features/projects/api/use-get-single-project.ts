import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
export const useGetSingleProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: {
          projectId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
