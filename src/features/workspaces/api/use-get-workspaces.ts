import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import type { GetWorkspacesResponse } from "../types/workspace";
import type { Models } from "node-appwrite";
export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = (await response.json()) as GetWorkspacesResponse;
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
