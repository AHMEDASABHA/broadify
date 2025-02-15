import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import type { Models } from "node-appwrite";
export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: {
          workspaceId: workspaceId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return {
        total: 0,
        documents: [],
      } as Models.DocumentList<Models.Document>;
    },
  });

  return query;
};
