import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type DeleteProjectResponse = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;
type DeleteProjectRequest = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeleteProjectResponse,
    Error,
    DeleteProjectRequest
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Failed to delete project");
      console.error("Delete project error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.$id],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },

  });

  return mutation;
};
